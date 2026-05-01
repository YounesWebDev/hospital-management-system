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

        return $this->hospitalPage('patient/profile', 'My Profile', [[
            'code' => $patient?->patient_code,
            'name' => $patient?->user?->name,
            'email' => $patient?->user?->email,
            'phone' => $patient?->user?->phone,
        ]]);
    }

    /**
     * Show patient appointments.
     */
    public function appointments()
    {
        // Return the current patient's appointments in newest-first order.
        return $this->hospitalPage('patient/appointments/index', 'My Appointments', Appointment::query()
            ->where('patient_id', $this->patient()?->id)
            ->latest()
            ->get());
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
        return $this->hospitalPage('patient/analyses/index', 'My Analyses', $this->patient()?->analysisRequests()->latest()->get() ?? []);
    }

    /**
     * Show patient billing.
     */
    public function billing()
    {
        // Return the billing records linked to the current patient's profile.
        return $this->hospitalPage('patient/billing/index', 'My Billing', BillingRecord::query()
            ->where('patient_id', $this->patient()?->id)
            ->latest()
            ->get());
    }

    /**
     * Show patient payment history.
     */
    public function payments()
    {
        // Return the payment history linked to the current patient's profile.
        return $this->hospitalPage('patient/payments/index', 'My Payments', Payment::query()
            ->where('patient_id', $this->patient()?->id)
            ->latest()
            ->get());
    }

    /**
     * Show patient notifications.
     */
    public function notifications()
    {
        // Return notifications where the current user is the receiver.
        return $this->hospitalPage('patient/notifications/index', 'My Notifications', Notification::query()
            ->where('receiver_id', auth()->id())
            ->latest()
            ->get(), [
                'readBase' => url('/patient/notifications'),
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
