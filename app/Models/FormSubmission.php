<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'template_id',
        'employee_id',
        'department',
        'status',
        'approved_by',
        'approved_at',
        'data',
        'notes',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'data' => 'array',
    ];

    public function template()
    {
        return $this->belongsTo(FormTemplate::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
