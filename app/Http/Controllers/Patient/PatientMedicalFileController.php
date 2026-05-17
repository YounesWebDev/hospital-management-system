<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BillingRecord;
use App\Models\Notification;
use App\Models\PatientProfile;
use App\Models\Payment;
use App\Models\Prescription;
use Inertia\Inertia;

class PatientMedicalFileController extends Controller
{
    /**
     * Show patient profile data.
     */
    public function profile()
    {
        // Fetch the logged-in user's patient profile and load the account fields shown on screen.
        $patient = $this->patient();
        $patient?->load('user:id,name,email,username,phone');

        return Inertia::render('patient/profile', [
            'title' => 'My Profile',
            'records' => [[
                'code' => $patient?->patient_code,
                'name' => $patient?->user?->name,
                'email' => $patient?->user?->email,
                'phone' => $patient?->user?->phone,
            ]],
        ]);
    }

    /**
     * Show patient appointments.
     */
    public function appointments()
    {
        // Return the current patient's appointments in newest-first order.
        $appointments = Appointment::query()
            ->where('patient_id', $this->patient()?->id)
            ->with(['patient.user:id,name', 'doctor.user:id,name'])
            ->latest()
            ->get()
            ->map(fn (Appointment $appointment): array => [
                'id' => $appointment->id,
                'patient' => $appointment->patient?->user?->name,
                'doctor' => $appointment->doctor?->user?->name,
                'date' => $appointment->appointment_date?->toDateString(),
                'time' => $appointment->appointment_time,
                'status' => $appointment->status,
            ]);

        return Inertia::render('patient/appointments/index', [
            'title' => 'My Appointments',
            'records' => $appointments,
        ]);
    }

    /**
     * Show patient prescriptions.
     */
    public function prescriptions()
    {
        $patient = $this->patient();

        $prescriptions = $patient?->prescriptions()
            ->with(['doctor.user:id,name', 'items'])
            ->latest()
            ->get()
            ->map(fn (Prescription $prescription): array => $this->formatPrescription($prescription))
            ->values() ?? collect();

        return Inertia::render('patient/prescriptions/index', [
            'title' => 'My Prescriptions',
            'prescriptions' => $prescriptions,
        ]);
    }

    /**
     * Show patient analyses.
     */
    public function analyses()
    {
        // Return only analysis requests linked to the current patient's profile.
        $analyses = $this->patient()?->analysisRequests()
            ->with(['doctor.user:id,name'])
            ->latest()
            ->get()
            ->map(fn ($analysis) => [
                'id' => $analysis->id,
                'doctor' => $analysis->doctor?->user?->name,
                'type' => $analysis->analysis_type,
                'status' => $analysis->status,
                'created_at' => $analysis->created_at?->toDateString(),
                'result' => $analysis->result,
            ]) ?? collect();

        return Inertia::render('patient/analyses/index', [
            'title' => 'My Analyses',
            'records' => $analyses,
        ]);
    }

    /**
     * Show patient billing.
     */
    public function billing()
    {
        // Return the billing records linked to the current patient's profile.
        $records = BillingRecord::query()
            ->where('patient_id', $this->patient()?->id)
            ->latest()
            ->get()
            ->map(fn (BillingRecord $record) => [
                'id' => $record->id,
                'amount' => $record->total_amount,
                'status' => $record->status,
                'created_at' => $record->created_at?->toDateString(),
                'description' => $record->description,
            ]);

        return Inertia::render('patient/billing/index', [
            'title' => 'My Billing',
            'records' => $records,
        ]);
    }

    /**
     * Show patient payment history.
     */
    public function payments()
    {
        // Return the payment history linked to the current patient's profile.
        $payments = Payment::query()
            ->where('patient_id', $this->patient()?->id)
            ->with('billingRecord')
            ->latest()
            ->get()
            ->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'amount' => $payment->amount_paid,
                'date' => $payment->paid_at?->toDateString(),
                'method' => $payment->payment_method,
                'status' => $payment->billingRecord?->status ?? 'N/A',
            ]);

        return Inertia::render('patient/payments/index', [
            'title' => 'My Payments',
            'records' => $payments,
        ]);
    }

    /**
     * Show patient notifications.
     */
    public function notifications()
    {
        // Return notifications where the current user is the receiver.
        $records = Notification::query()
            ->where('receiver_id', auth()->id())
            ->with('sender.user:id,name')
            ->latest()
            ->get()
            ->map(fn (Notification $n) => [
                'id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'sender' => $n->sender?->user?->name ?? 'System',
                'created_at' => $n->created_at?->toDateString(),
                'is_read' => $n->is_read,
            ]);

        return Inertia::render('patient/notifications/index', [
            'title' => 'My Notifications',
            'records' => $records,
            'actions' => [
                'markAsRead' => route('patient.notifications.read'),
            ],
        ]);
    }

    /**
     * Mark one notification as read.
     */
    public function markNotificationRead(Notification $notification)
    {
        // Stop patients from marking another user's notification as read.
        abort_unless($notification->receiver_id === auth()->id(), 403);

        $notification->update([
            'is_read' => true,
        ]);

        return response()->noContent();
    }

    /**
     * Get current user's patient profile.
     */
    private function patient(): ?PatientProfile
    {
        // Resolve the current logged-in user to the patient profile used by these pages.
        return PatientProfile::query()->where('user_id', auth()->id())->first();
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
            // Keep medicine and doctor separate so the frontend cannot show the wrong label by mistake.
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
