<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use App\Models\Appointment;
use App\Models\BillingRecord;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\Payment;
use App\Models\Prescription;
use App\Models\StaffProfile;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Show simple admin report totals.
     */
    public function index()
    {
        $stats = [
            'Patients' => PatientProfile::query()->count('*'),
            'Staff' => StaffProfile::query()->count('*'),
            'Doctors' => DoctorProfile::query()->count('*'),
            'Lab requests' => AnalysisRequest::query()->count('*'),
            'Prescriptions' => Prescription::query()->count('*'),
            'Appointments' => Appointment::query()->count('*'),
            'Revenue' => (string) Payment::query()->sum('amount_paid'),
            'Paid bills' => BillingRecord::query()->where('status', 'paid')->count('*'),
            'Unpaid bills' => BillingRecord::query()->where('status', 'unpaid')->count('*'),
        ];

        return Inertia::render('admin/reports/index', [
            'title' => 'Reports',
            // Each stat is a quick count or total pulled from one main table.
            'stats' => $stats,
        ]);
    }

    /**
     * Admin overview of appointments.
     */
    public function appointments()
    {
        // Show the newest appointments first so admin can review recent activity quickly.
        $appointments = Appointment::query()
            ->with(['patient.user', 'doctor.user'])
            ->latest()
            ->get()
            ->map(fn (Appointment $appointment) => [
                'id' => $appointment->id,
                'patient' => [
                    'patient_code' => $appointment->patient?->patient_code,
                    'user' => [
                        'name' => $appointment->patient?->user?->name,
                    ],
                ],
                'doctor' => [
                    'name' => $appointment->doctor?->user?->name,
                ],
                'type' => $appointment->type,
                'status' => $appointment->status,
                'appointment_date' => $appointment->appointment_date?->toDateString(),
                'appointment_time' => $appointment->appointment_time,
                'created_at' => $appointment->created_at,
            ]);

        return Inertia::render('admin/appointments/index', [
            'title' => 'Appointments',
            'records' => $appointments,
        ]);
    }

    /**
     * Admin overview of analysis requests.
     */
    public function analyses()
    {
        // Show the newest lab requests first for an operations overview.
        $analyses = AnalysisRequest::query()
            ->with(['patient.user'])
            ->latest()
            ->get()
            ->map(fn (AnalysisRequest $request) => [
                'id' => $request->id,
                'patient' => [
                    'patient_code' => $request->patient?->patient_code,
                    'user' => [
                        'name' => $request->patient?->user?->name,
                    ],
                ],
                'analysis_type' => $request->analysis_type,
                'status' => $request->status,
                'created_at' => $request->created_at,
            ]);

        return Inertia::render('admin/analyses/index', [
            'title' => 'Analyses',
            'records' => $analyses,
        ]);
    }

    /**
     * Admin overview of billing records.
     */
    public function billing()
    {
        // Show the newest billing records first for finance review.
        $billing = BillingRecord::query()
            ->with(['patient.user'])
            ->latest()
            ->get()
            ->map(fn (BillingRecord $record) => [
                'id' => $record->id,
                'patient' => [
                    'patient_code' => $record->patient?->patient_code,
                    'user' => [
                        'name' => $record->patient?->user?->name,
                    ],
                ],
                'total_amount' => $record->total_amount,
                'remaining_amount' => $record->remaining_amount,
                'status' => $record->status,
                'created_at' => $record->created_at,
            ]);

        return Inertia::render('admin/billing/index', [
            'title' => 'Billing',
            'records' => $billing,
        ]);
    }

    /**
     * Admin overview of payments.
     */
    public function payments()
    {
        // Show the newest payments first for cashflow tracking.
        $payments = Payment::query()
            ->with(['billingRecord.patient.user'])
            ->latest()
            ->get()
            ->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'billing' => [
                    'billing_code' => $payment->billingRecord?->billing_code,
                    'patient' => [
                        'user' => [
                            'name' => $payment->billingRecord?->patient?->user?->name,
                        ],
                    ],
                ],
                'amount' => $payment->amount_paid,
                'payment_date' => $payment->paid_at,
                'payment_method' => $payment->payment_method,
                'status' => $payment->status ?? 'completed',
                'created_at' => $payment->created_at,
            ]);

        return Inertia::render('admin/payments/index', [
            'title' => 'Payments',
            'records' => $payments,
        ]);
    }
}
