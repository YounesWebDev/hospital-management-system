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
        // Show the newest notifications first and expose the route used to send a new one.
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
        // Validate the reminder fields before creating the notification.
        $data = $request->validate([
            'receiver_id' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:191'],
            'message' => ['required', 'string'],
        ]);

        // Make sure the receiver is really a patient before sending the reminder.
        $receiver = User::query()
            ->where('role', 'patient')
            ->findOrFail($data['receiver_id']);

        $notification = Notification::query()->create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $receiver->id,
            'title' => $data['title'],
            'message' => $data['message'],
            'type' => 'appointment',
            'is_read' => false,
        ]);

        // Keep a simple record showing that reception sent a notification.
        $this->audit('sent_notification', 'notifications', $notification->id, $notification->title);

        return response()->noContent();
    }
}
