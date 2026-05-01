<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => fn () => $this->sharedNotifications($request),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Share the latest notifications for the header bell.
     *
     * @return array{unreadCount:int, items: array<int, array<string, mixed>>}
     */
    private function sharedNotifications(Request $request): array
    {
        $user = $request->user();

        if ($user === null) {
            return [
                'unreadCount' => 0,
                'items' => [],
            ];
        }

        $notifications = Notification::query()
            ->with('sender:id,name')
            ->where('receiver_id', $user->id)
            ->latest()
            ->limit(6)
            ->get();

        return [
            'unreadCount' => Notification::query()
                ->where('receiver_id', $user->id)
                ->where('is_read', false)
                ->count(),
            'items' => $notifications
                ->map(fn (Notification $notification): array => [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'is_read' => $notification->is_read,
                    'sender_name' => $notification->sender?->name,
                    'time' => $notification->created_at?->diffForHumans(),
                    'open_url' => route('notifications.open', $notification),
                ])
                ->values()
                ->all(),
        ];
    }
}
