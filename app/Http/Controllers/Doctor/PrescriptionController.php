<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use App\Models\DoctorProfile;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrescriptionController extends Controller
{
    /**
     * Show list of prescriptions with search.
     */
    public function index(Request $request)
    {
        $query = $request->query('search');

        $prescriptions = Prescription::query()
            ->with(['patient.user', 'items'])
            ->where(function ($q) use ($query) {
                if ($query) {
                    $q->whereHas('patient', function ($pq) use ($query) {
                        $pq->where('patient_code', 'like', "%{$query}%")
                           ->orWhereHas('user', function ($uq) use ($query) {
                            $uq->where('name', 'like', "%{$query}%");
                           });
                    });
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->appends(['search' => $query]);

        return Inertia::render('doctor/prescriptions/index', [
            'prescriptions' => $prescriptions,
            'filters' => [
                'search' => $query,
            ]
        ]);
    }

    /**
     * Show a specific prescription.
     */
    public function show(Prescription $prescription)
    {
        $prescription->load(['patient.user', 'items']);

        return Inertia::render('doctor/prescriptions/show', [
            'prescription' => $prescription,
        ]);
    }

    /**
     * Show a simple prescription form.
     */
    public function create()
    {
        return Inertia::render('doctor/prescriptions/create', [
            'actions' => [
                'store' => route('doctor.prescriptions.store'),
            ],
            'fields' => [
                [
                    'name' => 'patient_id',
                    'label' => 'Patient',
                    'type' => 'select',
                    'required' => true,
                    'options' => $this->patientOptions(),
                ],
                ['name' => 'diagnosis', 'label' => 'Diagnosis', 'type' => 'textarea'],
                ['name' => 'medicine_name', 'label' => 'Medicine name', 'required' => true],
                ['name' => 'dosage', 'label' => 'Dosage'],
                ['name' => 'duration', 'label' => 'Duration'],
                ['name' => 'instructions', 'label' => 'Instructions', 'type' => 'textarea'],
            ],
        ]);
    }

    /**
     * Store a prescription with one medicine line.
     */
    public function store(Request $request)
    {
        // Validate the prescription header and the first medicine line.
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patient_profiles,id'],
            'diagnosis' => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
            'medicine_name' => ['required', 'string', 'max:191'],
            'dosage' => ['nullable', 'string', 'max:191'],
            'duration' => ['nullable', 'string', 'max:191'],
        ]);

        // Find the doctor profile linked to the logged-in user.
        $doctorId = DoctorProfile::query()->where('user_id', $request->user()->id)->value('id');

        $prescription = Prescription::query()->create([
            'patient_id' => $data['patient_id'],
            'doctor_id' => $doctorId,
            'diagnosis' => $data['diagnosis'] ?? null,
            'instructions' => $data['instructions'] ?? null,
        ]);

        // Save the first medicine item under the new prescription.
        $prescription->items()->create([
            'medicine_name' => $data['medicine_name'],
            'dosage' => $data['dosage'] ?? null,
            'duration' => $data['duration'] ?? null,
            'instructions' => $data['instructions'] ?? null,
        ]);

        // Record that a doctor created a prescription.
        $this->audit('added_prescription', 'prescriptions', $prescription->id, 'Doctor added prescription');

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
