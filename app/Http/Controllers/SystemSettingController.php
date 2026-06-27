<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SystemSetting;

class SystemSettingController extends Controller
{
    public function index()
    {
        $setting = SystemSetting::first();
        if (!$setting) {
            $setting = SystemSetting::create([
                'app_name' => 'Food Safety App',
                'app_logo_base64' => null,
                'guidelines_base64' => null,
                'smtp_host' => null,
                'smtp_port' => null,
                'smtp_user' => null,
                'smtp_pass' => null,
                'theme_color' => '#1890ff',
            ]);
        }
        return response()->json($setting);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:100',
            'app_logo_base64' => 'nullable|string',
            'guidelines_base64' => 'nullable|string',
            'smtp_host' => 'nullable|string|max:255',
            'smtp_port' => 'nullable|string|max:10',
            'smtp_user' => 'nullable|string|max:255',
            'smtp_pass' => 'nullable|string|max:255',
            'theme_color' => 'nullable|string|max:50',
            'firebase_api_key' => 'nullable|string|max:255',
            'firebase_auth_domain' => 'nullable|string|max:255',
            'firebase_project_id' => 'nullable|string|max:255',
            'firebase_storage_bucket' => 'nullable|string|max:255',
            'firebase_messaging_sender_id' => 'nullable|string|max:255',
            'firebase_app_id' => 'nullable|string|max:255',
            'firebase_server_key' => 'nullable|string|max:500',
        ]);

        $setting = SystemSetting::first();
        if (!$setting) {
            $setting = new SystemSetting();
        }

        $setting->app_name = $request->app_name;
        
        $fields = [
            'app_logo_base64', 'guidelines_base64', 'smtp_host',
            'smtp_port', 'smtp_user', 'smtp_pass', 'theme_color',
            'firebase_api_key', 'firebase_auth_domain', 'firebase_project_id',
            'firebase_storage_bucket', 'firebase_messaging_sender_id',
            'firebase_app_id', 'firebase_server_key'
        ];
        
        foreach ($fields as $field) {
            if ($request->has($field)) {
                $setting->$field = $request->$field;
            }
        }
        
        $setting->save();

        return response()->json($setting);
    }

    public function firebaseConfig()
    {
        $setting = SystemSetting::first();
        if (!$setting) {
            return response()->json([], 200);
        }

        return response()->json([
            'apiKey' => $setting->firebase_api_key,
            'authDomain' => $setting->firebase_auth_domain,
            'projectId' => $setting->firebase_project_id,
            'storageBucket' => $setting->firebase_storage_bucket,
            'messagingSenderId' => $setting->firebase_messaging_sender_id,
            'appId' => $setting->firebase_app_id,
        ], 200);
    }
}
