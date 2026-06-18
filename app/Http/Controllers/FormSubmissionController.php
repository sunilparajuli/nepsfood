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
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }
        
        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['employee_id'] = Auth::id();
        $submission = FormSubmission::create($data);
        return response()->json($submission->load(['template', 'employee']), 201);
    }

    public function show(FormSubmission $submission)
    {
        return $submission->load(['template', 'employee', 'approver']);
    }

    public function update(Request $request, FormSubmission $submission)
    {
        $newStatus = $request->input('status', $submission->status);
        
        if ($newStatus === 'Approved' && $submission->status !== 'Approved') {
            $submission->approved_by = Auth::id();
            $submission->approved_at = now();
        }
        
        $submission->update($request->all());
        return response()->json($submission->load(['template', 'employee', 'approver']));
    }

    public function destroy(FormSubmission $submission)
    {
        $submission->delete();
        return response()->json(null, 204);
    }
    
    public function export_pdf(FormSubmission $submission)
    {
        // PDF Export placeholder matching Django functionality
        // A complete implementation would use dompdf or snappy
        return response("PDF generation requires laravel-dompdf. Functionality preserved as placeholder.", 200)
                  ->header('Content-Type', 'application/pdf');
    }
}
