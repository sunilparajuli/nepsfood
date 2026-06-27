<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        if (!$token && $request->has('token')) {
            $token = $request->query('token');
        }
        
        if (!$token) {
            return response()->json(['detail' => 'Authentication credentials were not provided.'], 401);
        }

        $secret = Config::get('app.key');
        if (strpos($secret, 'base64:') === 0) {
            $secret = base64_decode(substr($secret, 7));
        }

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            
            if ($decoded->token_type !== 'access') {
                return response()->json(['detail' => 'Token type is not valid.'], 401);
            }
            
            $user = User::find($decoded->user_id);
            if (!$user) {
                return response()->json(['detail' => 'User not found.'], 401);
            }

            // Set user for this request
            Auth::setUser($user);
            
        } catch (\Exception $e) {
            return response()->json(['detail' => 'Given token not valid for any token type', 'code' => 'token_not_valid'], 401);
        }

        return $next($request);
    }
}
