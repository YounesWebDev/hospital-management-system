<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Show appointment creation form.
     */
    public function create()
    {
        return Inertia::render('doctor/appointments/create', [
            'actions' => [
                'store' => route('doctor.appointments.store'),
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
                    'name' => 'type',
                    'label' => 'Type',
                    'type' => 'select',
                    'required' => true,
                    'options' => [
                        ['label' => 'Regular', 'value' => 'regular'],
                        ['label' => 'Operation', 'value' => 'operation'],
                    ],
                ],
                ['name' => 'appointment_date', 'label' => 'Date', 'type' => 'date', 'required' => true],
                ['name' => 'appointment_time', 'label' => 'Time', 'type' => 'time', 'required' => true],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea'],
            ],
        ]);
    }

    /**
     * Store a doctor-created appointment.
     */
    public function store(Request $request)
    {
        // Validate the form fields before creating the appointment.
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patient_profiles,id'],
            'type' => ['required', 'in:regular,operation'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required'],
            'notes' => ['nullable', 'string'],
        ]);

        // Find the doctor profile linked to the logged-in user.
        $doctorId = DoctorProfile::query()->where('user_id', auth()->id())->value('id');

        $appointment = Appointment::query()->create([
            'patient_id' => $data['patient_id'],
            'doctor_id' => $doctorId,
            'type' => $data['type'],
            'appointment_date' => $data['appointment_date'],
            'appointment_time' => $data['appointment_time'],
            'status' => 'scheduled',
            'notes' => $data['notes'] ?? null,
        ]);

        // Record that the doctor created a new appointment.
        $this->audit('created_appointment', 'appointments', $appointment->id, $appointment->type);

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
