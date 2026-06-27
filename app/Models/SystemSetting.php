<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'app_name',
        'app_logo_base64',
        'guidelines_base64',
        'smtp_host',
        'smtp_port',
        'smtp_user',
        'smtp_pass',
        'theme_color',
        'firebase_api_key',
        'firebase_auth_domain',
        'firebase_project_id',
        'firebase_storage_bucket',
        'firebase_messaging_sender_id',
        'firebase_app_id',
        'firebase_server_key'
    ];
}
