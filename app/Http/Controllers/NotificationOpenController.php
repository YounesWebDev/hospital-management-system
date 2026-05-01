<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationOpenController extends Controller
{
    /**
     * Mark the clicked notification as read and redirect to the target page.
     */
    public function __invoke(Request $request, Notification $notification): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user !== null && $notification->receiver_id === $user->id, 403);

        if (! $notification->is_read) {
            $notification->forceFill([
                'is_read' => true,
            ])->save();
        }

        return redirect()->to($this->destinationFor($notification, $user));
    }

    /**
     * Resolve the page that best matches this notification type.
     */
    private function destinationFor(Notification $notification, User $user): string
    {
        return match ($notification->type) {
            'appointment' => $this->appointmentDestinationFor($user),
            'analysis' => $this->analysisDestinationFor($user),
            'billing' => $this->billingDestinationFor($user),
            'payment' => $this->paymentDestinationFor($user),
            default => $this->dashboardDestinationFor($user),
        };
    }

    /**
     * Send the user to the appointment page that matches their role.
     */
    private function appointmentDestinationFor(User $user): string
    {
        return match ($user->role) {
            'patient' => route('patient.appointments.index'),
            'receptionist' => route('receptionist.appointments.index'),
            default => $this->dashboardDestinationFor($user),
        };
    }

    /**
     * Send the user to the analysis page that matches their role.
     */
    private function analysisDestinationFor(User $user): string
    {
        return match ($user->role) {
            'patient' => route('patient.analyses.index'),
            'lab_technician' => route('lab.analysis-requests.index'),
            default => $this->dashboardDestinationFor($user),
        };
    }

    /**
     * Send the user to the billing page that matches their role.
     */
    private function billingDestinationFor(User $user): string
    {
        return match ($user->role) {
            'patient' => route('patient.billing.index'),
            default => $this->dashboardDestinationFor($user),
        };
    }

    /**
     * Send the user to the payment page that matches their role.
     */
    private function paymentDestinationFor(User $user): string
    {
        return match ($user->role) {
            'patient' => route('patient.payments.index'),
            default => $this->dashboardDestinationFor($user),
        };
    }

    /**
     * Fall back to the role dashboard when no special destination exists.
     */
    private function dashboardDestinationFor(User $user): string
    {
        $routeName = match ($user->role) {
            'admin' => 'admin.dashboard',
            'receptionist' => 'receptionist.dashboard',
            'doctor' => 'doctor.dashboard',
            'lab_technician' => 'lab.dashboard',
            'accountant' => 'accountant.dashboard',
            'patient' => 'patient.dashboard',
            default => 'dashboard',
        };

        return route($routeName);
    }
}
