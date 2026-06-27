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
        // Exclude the heavy 'file' column from the index list to avoid massive payloads
        $query = SharedFile::select('id', 'title', 'folder_id', 'uploaded_by', 'created_at', 'updated_at')
            ->orderByDesc('created_at');
        
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

        // Expects 'title' and 'file' (base64) to be provided directly in $data
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
        $file->update($data);
        return response()->json($file);
    }

    public function destroy(SharedFile $file)
    {
        $file->delete();
        return response()->json(null, 204);
    }
}
