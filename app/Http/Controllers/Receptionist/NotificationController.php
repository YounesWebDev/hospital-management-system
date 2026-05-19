<?php

namespace App\Http\Controllers\Receptionist;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Show notifications sent by reception.
     */
    public function index()
    {
        return Inertia::render('receptionist/notifications/index', [
            'title' => 'Notifications',

            'records' => Notification::query()
                ->with('receiver:id,name')
                ->latest()
                ->get(),

            'actions' => [
                'store' => route('receptionist.notifications.store'),
            ],
        ]);
    }

    /**
     * Send a simple patient reminder.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:191'],
            'message' => ['required', 'string'],
        ]);

        // Make sure the receiver is a patient
        $receiver = User::query()
            ->where('role', 'patient')
            ->findOrFail($data['receiver_id']);

        /**
         * Prevent duplicate appointment notifications.
         * If the patient already received an appointment notification,
         * do not allow sending another one.
         */
        $alreadyNotified = Notification::query()
            ->where('receiver_id', $receiver->id)
            ->where('type', 'appointment')
            ->exists();

        if ($alreadyNotified) {
            return back()->with(
                'error',
                'This patient has already been notified.'
            );
        }

        // Create notification
        $notification = Notification::query()->create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $receiver->id,
            'title' => $data['title'],
            'message' => $data['message'],
            'type' => 'appointment',
            'is_read' => false,
        ]);

        // Audit log
        $this->audit(
            'sent_notification',
            'notifications',
            $notification->id,
            $notification->title
        );

        return redirect()
            ->route('receptionist.notifications.index')
            ->with('success', 'Notification sent successfully.');
    }
}