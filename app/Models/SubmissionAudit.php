<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubmissionAudit extends Model
{
    protected $fillable = [
        'submission_id',
        'user_id',
        'action',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function submission()
    {
        return $this->belongsTo(FormSubmission::class);
    }
}
