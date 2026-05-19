<?php

namespace App\Http\Controllers\Receptionist;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display appointments list.
     */
    public function index()
    {
        $appointments = Appointment::query()
            ->with([
                'patient.user:id,name',
                'doctor.user:id,name',
            ])
            ->latest()
            ->get();

        return Inertia::render('receptionist/appointments/index', [
            'records' => $appointments->map(function ($appointment) {
                return [
                    'id' => $appointment->id,

                    'patient' => $appointment->patient?->user?->name,

                    'patient_user_id' => $appointment->patient?->user?->id,

                    'doctor' => $appointment->doctor?->user?->name,

                    'date' => $appointment->appointment_date?->toDateString(),

                    'time' => $appointment->appointment_time,

                    'status' => $appointment->status,

                    'is_soon' => $appointment->appointment_date ? now()->diffInDays($appointment->appointment_date, false) === 3 : false,

                    'is_notified' => Notification::query()
                        ->where('receiver_id', $appointment->patient?->user?->id)
                        ->where('type', 'appointment')
                        ->exists(),
                ];
            }),
        ]);
    }
}