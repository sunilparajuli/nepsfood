<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'can_view_dashboard',
        'can_manage_templates',
        'can_manage_forms',
        'can_manage_users',
        'can_manage_roles',
        'can_manage_files',
        'can_view_reports',
        'is_admin_override',
        'permissions',
    ];

    protected $casts = [
        'can_view_dashboard' => 'boolean',
        'can_manage_templates' => 'boolean',
        'can_manage_forms' => 'boolean',
        'can_manage_users' => 'boolean',
        'can_manage_roles' => 'boolean',
        'can_manage_files' => 'boolean',
        'can_view_reports' => 'boolean',
        'is_admin_override' => 'boolean',
        'permissions' => 'array',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
