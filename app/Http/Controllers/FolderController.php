<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Folder;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Folder::orderBy('name');
        
        $parentId = $request->query('parent', 'root');
        if ($parentId === 'root') {
            $query->whereNull('parent_id');
        } elseif ($parentId) {
            $query->where('parent_id', $parentId);
        }

        if (!$user->role || !$user->role->can_manage_files) {
            $query->where('created_by', $user->id);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['created_by'] = Auth::id();
        $folder = Folder::create($data);
        return response()->json($folder, 201);
    }

    public function show(Folder $folder)
    {
        return $folder;
    }

    public function update(Request $request, Folder $folder)
    {
        $folder->update($request->all());
        return response()->json($folder);
    }

    public function destroy(Folder $folder)
    {
        $folder->delete();
        return response()->json(null, 204);
    }
}
