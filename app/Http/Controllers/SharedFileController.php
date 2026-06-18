<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SharedFile;
use Illuminate\Support\Facades\Auth;

class SharedFileController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = SharedFile::orderByDesc('created_at');
        
        $folderId = $request->query('folder', 'root');
        if ($folderId === 'root') {
            $query->whereNull('folder_id');
        } elseif ($folderId) {
            $query->where('folder_id', $folderId);
        }

        if (!$user->role || !$user->role->can_manage_files) {
            $query->where('uploaded_by', $user->id);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['uploaded_by'] = Auth::id();
        
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('shared_files', 'public');
            $data['file'] = $path;
        }

        $sharedFile = SharedFile::create($data);
        return response()->json($sharedFile, 201);
    }

    public function show(SharedFile $file)
    {
        return $file;
    }

    public function update(Request $request, SharedFile $file)
    {
        $data = $request->all();
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('shared_files', 'public');
            $data['file'] = $path;
        }
        $file->update($data);
        return response()->json($file);
    }

    public function destroy(SharedFile $file)
    {
        $file->delete();
        return response()->json(null, 204);
    }
}
