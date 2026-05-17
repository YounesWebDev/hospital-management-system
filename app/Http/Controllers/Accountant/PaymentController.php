<?php

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Models\BillingRecord;
use App\Models\Payment;
use App\Models\StaffProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Show payment history for the accountant.
     */
    public function index()
    {
        $payments = Payment::query()
            ->with(['patient.user:id,name', 'billingRecord'])
            ->latest()
            ->get()
            ->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount_paid,
                'date' => $payment->paid_at?->toDateString(),
                'method' => $payment->payment_method,
                'patient' => $payment->patient?->user?->name,
                'receipt' => $payment->receipt_number,
                'status' => $payment->billingRecord?->status ?? 'N/A',
            ]);

        return Inertia::render('accountant/payments/index', [
            'title' => 'Payment History',
            'records' => $payments,
        ]);
    }

    /**
     * Show payment creation form.
     */
    public function create(BillingRecord $billing)
    {
        // Pass the selected bill and the submit route to the payment form page.
        return Inertia::render('accountant/payments/create', [
            'title' => 'Record Payment',
            'records' => [$billing],
            'actions' => [
                'store' => route('accountant.payments.store', ['billing' => $billing]),
            ],
        ]);
    }

    /**
     * Record payment and update billing totals.
     */
    public function store(Request $request, BillingRecord $billing)
    {
        // Validate the payment details before updating finance records.
        $data = $request->validate([
            'amount_paid' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'in:cash,card,transfer'],
        ]);

        // Work out the new totals before saving the payment.
        $paidAmount = $billing->paid_amount + $data['amount_paid'];
        $remainingAmount = max(0, $billing->total_amount - $paidAmount);
        $accountantId = StaffProfile::query()->where('user_id', $this->currentUserId())->value('id');

        // Save the payment record itself.
        $payment = Payment::query()->create([
            'billing_record_id' => $billing->id,
            'patient_id' => $billing->patient_id,
            'accountant_id' => $accountantId,
            'amount_paid' => $data['amount_paid'],
            'payment_method' => $data['payment_method'],
            'receipt_number' => 'R-'.now()->format('YmdHis'),
            'paid_at' => now(),
        ]);

        // Update the parent bill so its paid and remaining amounts stay accurate.
        $billing->paid_amount = $paidAmount;
        $billing->remaining_amount = $remainingAmount;
        $billing->status = $remainingAmount <= 0 ? 'paid' : 'partially_paid';
        $billing->save();

        // Record that the accountant posted a payment.
        $this->audit('recorded_payment', 'payments', $payment->id, $payment->receipt_number);

        return response()->noContent();
    }
}
