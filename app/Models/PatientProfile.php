<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PatientProfile extends Model
{
    protected $fillable = [
        'user_id',
        'patient_code',
        'gender',
        'birth_date',
        'address',
        'emergency_contact',
        'registered_by',
    ];

    /**
     * Cast patient dates to date objects.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }

    /**
     * User account for this patient.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Receptionist or admin who registered this patient.
     */
    public function registrar(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    /**
     * Appointments for this patient.
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    /**
     * Medical notes for this patient.
     */
    public function medicalNotes(): HasMany
    {
        return $this->hasMany(MedicalNote::class, 'patient_id');
    }

    /**
     * Prescriptions for this patient.
     */
    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'patient_id');
    }

    /**
     * Analysis requests for this patient.
     */
    public function analysisRequests(): HasMany
    {
        return $this->hasMany(AnalysisRequest::class, 'patient_id');
    }

    /**
     * Billing records for this patient.
     */
    public function billingRecords(): HasMany
    {
        return $this->hasMany(BillingRecord::class, 'patient_id');
    }

    /**
     * Payments made for this patient.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'patient_id');
    }
}
