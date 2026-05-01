<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BillingRecord;
use App\Models\MedicalNote;
use App\Models\PatientProfile;
use App\Models\Prescription;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientFileController extends Controller
{
    /**
     * Search patients by name, username, or patient code.
     */
    public function search(Request $request)
    {
        $search = $request->string('search')->toString();

        // Start with patient profiles and load only the user columns needed for the search results.
        $query = PatientProfile::query()
            ->with('user:id,name,email,username');

        if ($search !== '') {
            // Return patients whose code matches, or whose linked user name/username matches.
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('patient_code', 'like', "%{$search}%")
                    ->orWhereHas('user', function (Builder $userQuery) use ($search): void {
                        $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%");
                    });
            });
        }

        // Convert each patient profile into a small search result card for the doctor UI.
        $patients = $query
            ->latest()
            ->get()
            ->map(fn (PatientProfile $patient): array => [
                'id' => $patient->id,
                'code' => $patient->patient_code,
                'name' => $patient->user?->name,
                'email' => $patient->user?->email,
                'profile_url' => route('doctor.patients.show', $patient),
            ])
            ->values();

        return Inertia::render('doctor/patients/search', [
            'title' => 'Find Patient File',
            'search' => $search,
            'patients' => $patients,
            'stats' => [
                'Total patients' => PatientProfile::query()->count('*'),
                'Matching results' => $patients->count(),
                'Medical notes' => MedicalNote::query()->count('*'),
                'Prescriptions' => Prescription::query()->count('*'),
                'Appointments' => Appointment::query()->count('*'),
                'Billing records' => BillingRecord::query()->count('*'),
            ],
        ]);
    }

    /**
     * Show one patient medical file.
     */
    public function show(PatientProfile $patient)
    {
        // Load the related medical sections used by the doctor file page.
        $patient->load([
            'user:id,name,email,username',
            'medicalNotes.doctor.user:id,name',
            'prescriptions.doctor.user:id,name',
            'prescriptions.items',
            'analysisRequests.result',
            'appointments',
            'billingRecords.items',
        ]);

        return Inertia::render('doctor/patients/show', [
            'title' => 'Patient Medical File',
            'patient' => [
                'id' => $patient->id,
                'code' => $patient->patient_code,
                'name' => $patient->user?->name,
                'email' => $patient->user?->email,
                'username' => $patient->user?->username,
            ],
            // These summary counts give the doctor a fast snapshot of the patient's history.
            'summary' => [
                'notes' => $patient->medicalNotes->count(),
                'prescriptions' => $patient->prescriptions->count(),
                'analyses' => $patient->analysisRequests->count(),
                'appointments' => $patient->appointments->count(),
                'billing' => $patient->billingRecords->count(),
            ],
            // Notes are flattened so the React page can render a clear timeline without parsing nested models.
            'medicalNotes' => $patient->medicalNotes
                ->sortByDesc('created_at')
                ->values()
                ->map(fn (MedicalNote $note): array => [
                    'id' => $note->id,
                    'note' => $note->note,
                    'doctor' => $note->doctor?->user?->name,
                    'created_at' => $note->created_at?->diffForHumans(),
                ]),
            'prescriptions' => $patient->prescriptions
                ->sortByDesc('created_at')
                ->values()
                ->map(fn (Prescription $prescription): array => $this->formatPrescription($prescription)),
            'analyses' => $patient->analysisRequests
                ->sortByDesc('requested_at')
                ->values()
                ->map(fn ($analysis): array => [
                    'id' => $analysis->id,
                    'type' => $analysis->analysis_type,
                    'status' => $analysis->status,
                    'requested_at' => $analysis->requested_at?->toDateString(),
                    'result' => $analysis->result?->result_text,
                ]),
            'appointments' => $patient->appointments
                ->sortByDesc('appointment_date')
                ->values()
                ->map(fn ($appointment): array => [
                    'id' => $appointment->id,
                    'type' => $appointment->type,
                    'date' => $appointment->appointment_date?->toDateString(),
                    'time' => $appointment->appointment_time,
                    'status' => $appointment->status,
                    'notes' => $appointment->notes,
                ]),
            'billingRecords' => $patient->billingRecords
                ->sortByDesc('created_at')
                ->values()
                ->map(fn ($billing): array => [
                    'id' => $billing->id,
                    'total' => $billing->total_amount,
                    'paid' => $billing->paid_amount,
                    'remaining' => $billing->remaining_amount,
                    'status' => $billing->status,
                    'item_count' => $billing->items->count(),
                ]),
            'actions' => [
                'note' => route('doctor.medical-notes.store'),
                'back' => route('doctor.patients.search'),
            ],
        ]);
    }

    /**
     * Convert a prescription model into a simple page-friendly array.
     *
     * @return array{
     *     id:int,
     *     medicine:?string,
     *     doctor:?string,
     *     diagnosis:?string,
     *     instructions:?string,
     *     created_at:?string,
     *     items:\Illuminate\Support\Collection<int, array{name:?string, dosage:?string, duration:?string}>
     * }
     */
    private function formatPrescription(Prescription $prescription): array
    {
        return [
            'id' => $prescription->id,
            // The page title should always come from the medicine item, never from the doctor field.
            'medicine' => $prescription->items->first()?->medicine_name,
            'doctor' => $prescription->doctor?->user?->name,
            'diagnosis' => $prescription->diagnosis,
            'instructions' => $prescription->instructions,
            'created_at' => $prescription->created_at?->toDateString(),
            'items' => $prescription->items->map(fn ($item): array => [
                'name' => $item->medicine_name,
                'dosage' => $item->dosage,
                'duration' => $item->duration,
            ])->values(),
        ];
    }
}
