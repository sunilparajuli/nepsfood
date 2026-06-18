<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Carbon;

class JwtService
{
    /**
     * Generate an access and refresh token pair for a user
     */
    public static function generateTokenPair($user)
    {
        $secret = Config::get('app.key');
        // If app key has 'base64:' prefix, strip it
        if (strpos($secret, 'base64:') === 0) {
            $secret = base64_decode(substr($secret, 7));
        }

        $now = Carbon::now();
        
        // Match simplejwt claims structure
        $accessClaims = [
            'token_type' => 'access',
            'exp' => $now->copy()->addMinutes(60)->timestamp,
            'iat' => $now->timestamp,
            'jti' => bin2hex(random_bytes(16)),
            'user_id' => $user->id,
        ];

        $refreshClaims = [
            'token_type' => 'refresh',
            'exp' => $now->copy()->addDays(7)->timestamp,
            'iat' => $now->timestamp,
            'jti' => bin2hex(random_bytes(16)),
            'user_id' => $user->id,
        ];

        $accessToken = JWT::encode($accessClaims, $secret, 'HS256');
        $refreshToken = JWT::encode($refreshClaims, $secret, 'HS256');

        return [
            'access' => $accessToken,
            'refresh' => $refreshToken,
        ];
    }
    
    /**
     * Refresh a token
     */
    public static function refreshToken($token)
    {
        $secret = Config::get('app.key');
        if (strpos($secret, 'base64:') === 0) {
            $secret = base64_decode(substr($secret, 7));
        }

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            if ($decoded->token_type !== 'refresh') {
                return null;
            }
            
            $user = \App\Models\User::find($decoded->user_id);
            if (!$user) return null;
            
            // simplejwt typically just issues a new access token for a refresh
            $now = Carbon::now();
            $accessClaims = [
                'token_type' => 'access',
                'exp' => $now->copy()->addMinutes(60)->timestamp,
                'iat' => $now->timestamp,
                'jti' => bin2hex(random_bytes(16)),
                'user_id' => $user->id,
            ];
            
            return [
                'access' => JWT::encode($accessClaims, $secret, 'HS256')
            ];
        } catch (\Exception $e) {
            return null;
        }
    }
}
