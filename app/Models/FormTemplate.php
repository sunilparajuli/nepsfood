<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'department',
        'schema',
        'version',
        'issue_date',
    ];

    protected $casts = [
        'schema' => 'array',
        'issue_date' => 'date',
    ];
}
