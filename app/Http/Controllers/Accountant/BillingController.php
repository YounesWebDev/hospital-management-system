<?php

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Models\BillingRecord;
use App\Models\PatientProfile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    /**
     * Search patient billing records.
     */
    public function search(Request $request)
    {
        $search = $request->string('search')->toString();

        // Start with patient profiles and load the linked user fields shown in billing search.
        $query = PatientProfile::query()
            ->with('user:id,name,email,username');

        if ($search !== '') {
            // Return patients whose code matches, or whose linked user name matches.
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('patient_code', 'like', "%{$search}%")
                    ->orWhereHas('user', function (Builder $userQuery) use ($search): void {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Convert each patient into the small table row used by the billing search page.
        $patients = $query
            ->latest()
            ->get()
            ->map(fn (PatientProfile $patient): array => [
                'id' => $patient->id,
                'code' => $patient->patient_code,
                'name' => $patient->user?->name,
                'email' => $patient->user?->email,
            ]);

        return $this->hospitalPage('accountant/patients/search', 'Find Patient Billing', $patients);
    }

    /**
     * Show billing details.
     */
    public function show(BillingRecord $billing)
    {
        // Load the patient name, billing items, and payments needed for the bill detail page.
        $billing->load(['patient.user:id,name', 'items', 'payments']);

        // Send the main totals plus the payment action route used by the detail page.
        return $this->hospitalPage('accountant/billing/show', 'Billing Details', [[
            'id' => $billing->id,
            'patient' => $billing->patient?->user?->name,
            'total' => $billing->total_amount,
            'paid' => $billing->paid_amount,
            'remaining' => $billing->remaining_amount,
            'status' => $billing->status,
        ]], [
            'payment' => route('accountant.payments.create', $billing),
        ]);
    }
}
