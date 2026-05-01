<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AnalysisRequest extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'analysis_type',
        'description',
        'status',
        'requested_at',
        'started_at',
        'completed_at',
    ];

    /**
     * Cast analysis workflow dates.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'requested_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Patient this request belongs to.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    /**
     * Doctor who requested the analysis.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_id');
    }

    /**
     * Uploaded result for this request.
     */
    public function result(): HasOne
    {
        return $this->hasOne(AnalysisResult::class);
    }
}
