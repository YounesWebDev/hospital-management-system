<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalysisResult extends Model
{
    protected $fillable = [
        'analysis_request_id',
        'patient_id',
        'doctor_id',
        'lab_technician_id',
        'result_text',
        'file_path',
        'uploaded_at',
    ];

    /**
     * Cast upload date.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
        ];
    }

    /**
     * Request that produced this result.
     */
    public function analysisRequest(): BelongsTo
    {
        return $this->belongsTo(AnalysisRequest::class);
    }

    /**
     * Patient this result belongs to.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    /**
     * Doctor who requested this result.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_id');
    }

    /**
     * Lab technician who uploaded this result.
     */
    public function labTechnician(): BelongsTo
    {
        return $this->belongsTo(LabTechnicianProfile::class, 'lab_technician_id');
    }
}
