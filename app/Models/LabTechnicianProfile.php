<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabTechnicianProfile extends Model
{
    protected $fillable = [
        'user_id',
        'department',
    ];

    /**
     * User account for this lab technician.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Analysis results uploaded by this technician.
     */
    public function analysisResults(): HasMany
    {
        return $this->hasMany(AnalysisResult::class, 'lab_technician_id');
    }
}
