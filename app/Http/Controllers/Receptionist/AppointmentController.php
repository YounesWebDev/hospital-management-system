<?php

namespace App\Http\Controllers\Receptionist;

use App\Http\Controllers\Controller;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    /**
     * Reception can view appointments but not create them.
     */
    public function index()
    {
        // Load each appointment with the patient and doctor names shown to reception.
        $appointments = Appointment::query()
            ->with(['patient.user:id,name', 'doctor.user:id,name'])
            ->latest('appointment_date')
            ->get()
            // Shape each appointment into a small row for the frontend list.
            ->map(fn (Appointment $appointment): array => [
                'patient' => $appointment->patient?->user?->name,
                'doctor' => $appointment->doctor?->user?->name,
                'date' => $appointment->appointment_date?->toDateString(),
                'time' => $appointment->appointment_time,
                'status' => $appointment->status,
            ]);

        return $this->hospitalPage('receptionist/appointments/index', 'Appointments', $appointments);
    }
}
