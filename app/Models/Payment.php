<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'billing_record_id',
        'patient_id',
        'accountant_id',
        'amount_paid',
        'payment_method',
        'receipt_number',
        'paid_at',
    ];

    /**
     * Cast money and date fields.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount_paid' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Billing record this payment belongs to.
     */
    public function billingRecord(): BelongsTo
    {
        return $this->belongsTo(BillingRecord::class);
    }

    /**
     * Patient this payment is for.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientProfile::class, 'patient_id');
    }

    /**
     * Accountant who recorded this payment.
     */
    public function accountant(): BelongsTo
    {
        return $this->belongsTo(StaffProfile::class, 'accountant_id');
    }
}
