<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormSubmission;
use Illuminate\Support\Facades\Auth;

class FormSubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = FormSubmission::with(['template', 'employee', 'approver'])->orderBy('created_at', 'desc');
        
        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }
        if ($request->has('date') && $request->date) {
            $query->whereDate('created_at', $request->date);
        }
        if ($request->has('employee_id') && $request->employee_id !== 'All') {
            $query->where('employee_id', $request->employee_id);
        }
        if ($request->has('department') && $request->department !== 'All') {
            $query->whereHas('template', function($q) use ($request) {
                $q->where('department', $request->department);
            });
        }
        
        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['employee_id'] = Auth::id();
        $submission = FormSubmission::create($data);
        $submission->load(['template', 'employee']);

        // Log Audit
        \App\Models\SubmissionAudit::create([
            'submission_id' => $submission->id,
            'user_id' => Auth::id(),
            'action' => 'Created',
            'notes' => 'Initial submission.'
        ]);

        // Trigger Notifications for Admins
        $admins = \App\Models\User::whereHas('role', function($q) {
            $q->where('is_admin_override', true);
        })->get();

        $setting = \App\Models\SystemSetting::first();
        $serverKey = $setting ? $setting->firebase_server_key : null;

        $title = "New Submission: " . ($submission->template->title ?? 'Form');
        $body = "Submitted by " . ($submission->employee->name ?? 'User');

        foreach ($admins as $admin) {
            \App\Models\Notification::create([
                'user_id' => $admin->id,
                'title' => $title,
                'body' => $body,
            ]);

            if ($serverKey && $admin->fcm_token) {
                try {
                    \Illuminate\Support\Facades\Http::withHeaders([
                        'Authorization' => 'key=' . $serverKey,
                        'Content-Type' => 'application/json',
                    ])->post('https://fcm.googleapis.com/fcm/send', [
                        'to' => $admin->fcm_token,
                        'notification' => [
                            'title' => $title,
                            'body' => $body,
                        ],
                    ]);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('FCM Push Failed: ' . $e->getMessage());
                }
            }
        }

        return response()->json($submission, 201);
    }

    public function show(FormSubmission $submission)
    {
        return $submission->load(['template', 'employee', 'approver', 'audits.user']);
    }

    public function update(Request $request, FormSubmission $submission)
    {
        $newStatus = $request->input('status', $submission->status);
        $notes = $request->input('audit_notes', '');
        
        $statusChanged = $newStatus !== $submission->status;

        if ($statusChanged) {
            // Log Audit
            \App\Models\SubmissionAudit::create([
                'submission_id' => $submission->id,
                'user_id' => Auth::id(),
                'action' => $newStatus, // e.g., 'Approved', 'Reverted', 'Updated'
                'notes' => $notes
            ]);
        }
        
        if ($newStatus === 'Approved' && $submission->status !== 'Approved') {
            $submission->approved_by = Auth::id();
            $submission->approved_at = now();
        }
        
        $submission->update($request->except('audit_notes'));
        return response()->json($submission->load(['template', 'employee', 'approver', 'audits.user']));
    }

    public function destroy(FormSubmission $submission)
    {
        $submission->deleted_by = \Illuminate\Support\Facades\Auth::id();
        $submission->save();
        $submission->delete();
        return response()->json(['message' => 'Submission deleted successfully']);
    }
    
    public function export_pdf(FormSubmission $submission)
    {
        $submission->load(['template', 'employee', 'approver']);
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.submission', compact('submission'));
        $filename = $submission->template->name . '_' . $submission->created_at->format('Y-m-d') . '.pdf';
        // Sanitize filename to avoid weird characters
        $filename = preg_replace('/[^A-Za-z0-9_\-]/', '_', $filename);
        return $pdf->stream($filename, ['Attachment' => false]);
    }
}
