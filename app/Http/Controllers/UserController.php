<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::with('role')->orderByDesc('id')->get();
    }

    public function current_user(Request $request)
    {
        return Auth::user()->load('role');
    }

    public function current_user_update(Request $request)
    {
        $user = Auth::user();
        $data = $request->all();
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $user->update($data);
        return response()->json($user->load('role'));
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user->load('role');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->all();
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $user->update($data);
        return response()->json($user->load('role'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
