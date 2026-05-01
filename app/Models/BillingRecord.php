<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BillingRecord extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'status',
    ];

    /**
     * Cast money fields to decimals.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'remaining_amount' => 'decimal:2',
        ];
    }

    /**
     * Patient this billing record belongs to.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    /**
     * Doctor who opened the billing record.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_id');
    }

    /**
     * Fee lines in this bill.
     */
    public function items(): HasMany
    {
        return $this->hasMany(BillingItem::class);
    }

    /**
     * Payments recorded against this bill.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
