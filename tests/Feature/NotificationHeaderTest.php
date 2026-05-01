<?php

use App\Models\Notification;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard shares header notifications for the authenticated user', function () {
    $patient = User::factory()->create([
        'role' => 'patient',
    ]);

    $sender = User::factory()->create([
        'role' => 'receptionist',
        'name' => 'Nina Hall',
    ]);

    Notification::query()->create([
        'sender_id' => $sender->id,
        'receiver_id' => $patient->id,
        'title' => 'Upcoming appointment',
        'message' => 'Your appointment is confirmed for tomorrow.',
        'type' => 'appointment',
        'is_read' => false,
    ]);

    $this->actingAs($patient)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('notifications.unreadCount', 1)
            ->has('notifications.items', 1)
            ->where('notifications.items.0.title', 'Upcoming appointment')
            ->where('notifications.items.0.sender_name', 'Nina Hall')
        );
});

test('opening a notification marks it as read and redirects to the matching page', function () {
    $patient = User::factory()->create([
        'role' => 'patient',
    ]);

    $sender = User::factory()->create([
        'role' => 'receptionist',
    ]);

    $notification = Notification::query()->create([
        'sender_id' => $sender->id,
        'receiver_id' => $patient->id,
        'title' => 'Upcoming appointment',
        'message' => 'Your appointment is confirmed for tomorrow.',
        'type' => 'appointment',
        'is_read' => false,
    ]);

    $this->actingAs($patient)
        ->post(route('notifications.open', $notification))
        ->assertRedirect(route('patient.appointments.index'));

    expect($notification->fresh()->is_read)->toBeTrue();
});
