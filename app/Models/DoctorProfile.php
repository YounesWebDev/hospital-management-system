<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialization',
    ];

    /**
     * User account for this doctor.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Appointments created by this doctor.
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    /**
     * Medical notes written by this doctor.
     */
    public function medicalNotes(): HasMany
    {
        return $this->hasMany(MedicalNote::class, 'doctor_id');
    }

    /**
     * Prescriptions written by this doctor.
     */
    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'doctor_id');
    }

    /**
     * Analysis requests created by this doctor.
     */
    public function analysisRequests(): HasMany
    {
        return $this->hasMany(AnalysisRequest::class, 'doctor_id');
    }

    /**
     * Billing records opened by this doctor.
     */
    public function billingRecords(): HasMany
    {
        return $this->hasMany(BillingRecord::class, 'doctor_id');
    }
}
