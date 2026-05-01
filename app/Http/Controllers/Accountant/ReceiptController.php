<?php

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Models\Payment;

class ReceiptController extends Controller
{
    /**
     * Show printable receipt data.
     */
    public function show(Payment $payment)
    {
        // Load the related patient, accountant, and bill so the receipt can show context.
        $payment->load(['patient.user:id,name', 'accountant.user:id,name', 'billingRecord']);

        return $this->hospitalPage('accountant/receipts/show', 'Receipt', [[
            'receipt' => $payment->receipt_number,
            'patient' => $payment->patient?->user?->name,
            'amount' => $payment->amount_paid,
            'method' => $payment->payment_method,
            'remaining' => $payment->billingRecord?->remaining_amount,
            'accountant' => $payment->accountant?->user?->name,
        ]]);
    }
}
