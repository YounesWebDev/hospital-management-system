<?php

namespace App\Http\Controllers\Accountant;

use App\Http\Controllers\Controller;
use App\Models\BillingRecord;
use App\Models\PatientProfile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    /**
     * Show all billing records.
     */
    public function index()
    {
        $records = BillingRecord::query()
            ->with(['patient.user:id,name'])
            ->latest()
            ->get()
            ->map(fn (BillingRecord $record) => [
                'id' => $record->id,
                'patient' => $record->patient?->user?->name,
                'amount' => $record->total_amount,
                'status' => $record->status,
                'created_at' => $record->created_at?->toDateString(),
            ]);

        return Inertia::render('accountant/billing/index', [
            'title' => 'Billing Overview',
            'records' => $records,
        ]);
    }

    /**
     * Search patient billing records.
     */
    public function search(Request $request)
    {
        $search = $request->string('search')->toString();

        $query = PatientProfile::query()
            ->with(['user:id,name,email,username', 'billingRecords' => fn($q) => $q->latest()->limit(1)])
            ->latest();

        if ($search !== '') {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('patient_code', 'like', "%{$search}%")
                    ->orWhereHas('user', function (Builder $userQuery) use ($search): void {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $patients = $query
            ->get()
            ->map(fn (PatientProfile $patient): array => [
                'id' => $patient->id,
                'code' => $patient->patient_code,
                'name' => $patient->user?->name,
                'email' => $patient->user?->email,
                'latest_bill_id' => $patient->billingRecords->first()?->id,
                'latest_bill_status' => $patient->billingRecords->first()?->status,
            ]);

        return Inertia::render('accountant/patients/search', [
            'title' => 'Find Patient Billing',
            'records' => $patients,
        ]);
    }

    /**
     * Show billing details.
     */
    public function show(BillingRecord $billing)
    {
        // Load the patient name, billing items, and payments needed for the bill detail page.
        $billing->load(['patient.user:id,name', 'items', 'payments']);

        // Send the main totals plus the payment action route used by the detail page.
        return Inertia::render('accountant/billing/show', [
            'title' => 'Billing Details',
            'records' => [[
                'id' => $billing->id,
                'patient' => $billing->patient?->user?->name,
                'total' => $billing->total_amount,
                'paid' => $billing->paid_amount,
                'remaining' => $billing->remaining_amount,
                'status' => $billing->status,
            ]],
            'actions' => [
                'payment' => route('accountant.payments.create', $billing),
            ],
        ]);
    }
}
