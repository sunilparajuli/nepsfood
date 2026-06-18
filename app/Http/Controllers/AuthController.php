<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Services\JwtService;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Food Safety API",
 *      description="API documentation for Food Safety App Backend"
 * )
 *
 * @OA\Server(
 *      url="http://localhost:8000"
 * )
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/token",
     *     summary="Obtain JWT Token Pair",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username","password"},
     *             @OA\Property(property="username", type="string"),
     *             @OA\Property(property="password", type="string")
     *         )
     *     ),
     *     @OA\Response(response="200", description="Successful login")
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'detail' => 'No active account found with the given credentials'
            ], 401);
        }

        $tokens = JwtService::generateTokenPair($user);

        return response()->json($tokens);
    }

    /**
     * @OA\Post(
     *     path="/api/token/refresh",
     *     summary="Refresh JWT Access Token",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"refresh"},
     *             @OA\Property(property="refresh", type="string")
     *         )
     *     ),
     *     @OA\Response(response="200", description="Successful refresh")
     * )
     */
    public function refresh(Request $request)
    {
        $request->validate([
            'refresh' => 'required',
        ]);

        $tokens = JwtService::refreshToken($request->refresh);

        if (!$tokens) {
            return response()->json([
                'detail' => 'Token is invalid or expired',
                'code' => 'token_not_valid'
            ], 401);
        }

        return response()->json($tokens);
    }
}
