<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\BillingRecord;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    /**
     * List billing records for a doctor.
     */
    public function index(Request $request)
    {
        $search = $request->string('search');
        $doctorId = DoctorProfile::query()->where('user_id', $request->user()->id)->value('id');

        $billingRecords = BillingRecord::query()
            ->with(['patient.user'])
            ->where('doctor_id', $doctorId)
            ->when($search, function ($query, $search) {
                $query->whereHas('patient', function ($q) use ($search) {
                    $q->where('patient_code', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(12);

        return Inertia::render('doctor/billing/index', [
            'billing' => $billingRecords,
            'filters' => [
                'search' => $search,
            ],
            'actions' => [
                'create' => route('doctor.billing.create'),
            ],
        ]);
    }

    /**
     * Show specific billing record.
     */
    public function show(BillingRecord $billing)
    {
        return Inertia::render('doctor/billing/show', [
            'billing' => $billing->load(['patient.user', 'items']),
        ]);
    }

    /**
     * Show billing item creation form.
     */
    public function create()
    {
        return Inertia::render('doctor/billing/create', [
            'actions' => [
                'store' => route('doctor.billing.store'),
            ],
            'fields' => [
                [
                    'name' => 'patient_id',
                    'label' => 'Patient',
                    'type' => 'select',
                    'required' => true,
                    'options' => $this->patientOptions(),
                ],
                [
                    'name' => 'item_type',
                    'label' => 'Item type',
                    'type' => 'select',
                    'required' => true,
                    'options' => [
                        ['label' => 'Consultation', 'value' => 'consultation'],
                        ['label' => 'Analysis', 'value' => 'analysis'],
                        ['label' => 'Operation', 'value' => 'operation'],
                        ['label' => 'Room stay', 'value' => 'room_stay'],
                        ['label' => 'Other', 'value' => 'other'],
                    ],
                ],
                ['name' => 'description', 'label' => 'Description', 'required' => true],
                ['name' => 'amount', 'label' => 'Amount', 'type' => 'number', 'required' => true],
            ],
        ]);
    }


    /**
     * Add a fee and recalculate the bill.
     */
    public function store(Request $request)
    {
        // Validate the fee item before adding it to a patient's bill.
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patient_profiles,id'],
            'item_type' => ['required', 'in:consultation,analysis,operation,room_stay,other'],
            'description' => ['required', 'string', 'max:191'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $doctorId = DoctorProfile::query()->where('user_id', $request->user()->id)->value('id');

        // Reuse the patient's open unpaid bill, or create one if this is the first item.
        $billing = BillingRecord::query()->firstOrCreate(
            ['patient_id' => $data['patient_id'], 'status' => 'unpaid'],
            ['doctor_id' => $doctorId, 'total_amount' => 0, 'paid_amount' => 0, 'remaining_amount' => 0],
        );

        // Add the new fee item under that billing record.
        $item = $billing->items()->create([
            'item_type' => $data['item_type'],
            'description' => $data['description'],
            'amount' => $data['amount'],
            'added_by' => $request->user()->id,
        ]);

        // Recalculate totals after inserting the new item.
        $total = $billing->items()->sum('amount');

        $billing->update([
            'total_amount' => $total,
            'remaining_amount' => max(0, $total - $billing->paid_amount),
            'status' => $billing->paid_amount > 0 ? 'partially_paid' : 'unpaid',
        ]);

        // Record that a doctor added a charge to the bill.
        $this->audit('added_billing_item', 'billing_items', $item->id, $item->description);

        return response()->noContent();
    }

    /**
     * Build doctor-friendly patient dropdown options.
     *
     * @return array<int, array{label:string, value:string}>
     */
    private function patientOptions(): array
    {
        return PatientProfile::query()
            ->with('user:id,name')
            ->orderBy('patient_code')
            ->get()
            ->map(fn (PatientProfile $patient): array => [
                'label' => trim(($patient->patient_code ?? 'Patient').' - '.($patient->user?->name ?? 'Unknown')),
                'value' => (string) $patient->id,
            ])
            ->values()
            ->all();
    }
}
