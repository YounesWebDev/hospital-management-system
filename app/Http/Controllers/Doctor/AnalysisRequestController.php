<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalysisRequestController extends Controller
{
    /**
     * Show analysis request form.
     */
    public function create()
    {
        return Inertia::render('doctor/analysis-requests/create', [
            'actions' => [
                'store' => route('doctor.analysis-requests.store'),
            ],
            'fields' => [
                [
                    'name' => 'patient_id',
                    'label' => 'Patient',
                    'type' => 'select',
                    'required' => true,
                    'options' => $this->patientOptions(),
                ],
                ['name' => 'analysis_type', 'label' => 'Analysis type', 'required' => true],
                ['name' => 'description', 'label' => 'Description', 'type' => 'textarea'],
            ],
        ]);
    }

    /**
     * Store a doctor analysis request.
     */
    public function store(Request $request)
    {
        // Validate the lab request before saving it.
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patient_profiles,id'],
            'analysis_type' => ['required', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
        ]);

        // Find the doctor profile linked to the logged-in user.
        $doctorId = DoctorProfile::query()->where('user_id', auth()->id())->value('id');

        $analysisRequest = AnalysisRequest::query()->create([
            'patient_id' => $data['patient_id'],
            'doctor_id' => $doctorId,
            'analysis_type' => $data['analysis_type'],
            'description' => $data['description'] ?? null,
            'status' => 'requested',
            'requested_at' => now(),
        ]);

        // Record that the doctor asked the lab for an analysis.
        $this->audit('requested_analysis', 'analysis_requests', $analysisRequest->id, $analysisRequest->analysis_type);

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
