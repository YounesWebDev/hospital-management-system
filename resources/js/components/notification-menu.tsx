import { Link, usePage } from '@inertiajs/react';
import { Bell, BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type HeaderNotification = {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    sender_name?: string | null;
    time?: string | null;
    open_url: string;
};

type NotificationSharedProps = {
    notifications?: {
        unreadCount: number;
        items: HeaderNotification[];
    };
};

export function NotificationMenu() {
    const page = usePage<NotificationSharedProps>();
    const notifications = page.props.notifications?.items ?? [];
    const unreadCount = page.props.notifications?.unreadCount ?? 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-10 rounded-full border border-border/70 bg-background/90 shadow-sm"
                >
                    {unreadCount > 0 ? (
                        <BellDot className="size-4.5 text-foreground" />
                    ) : (
                        <Bell className="size-4.5 text-foreground" />
                    )}
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-[24rem] rounded-lg p-0"
                align="end"
            >
                <div className="border-b border-border/70 px-4 py-3">
                    <DropdownMenuLabel className="px-0 py-0 text-sm font-semibold">
                        Notifications
                    </DropdownMenuLabel>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {unreadCount > 0
                            ? `${unreadCount} unread notifications`
                            : 'No unread notifications'}
                    </p>
                </div>

                <div className="max-h-96 overflow-y-auto p-1.5">
                    {notifications.length === 0 ? (
                        <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                            New notifications will appear here.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                asChild
                                className="cursor-pointer rounded-lg p-0 focus:bg-transparent"
                            >
                                <Link
                                    href={notification.open_url}
                                    method="post"
                                    as="button"
                                    className={cn(
                                        'flex w-full flex-col items-start gap-2 rounded-lg border border-transparent px-3 py-3 text-left transition hover:border-border/70 hover:bg-muted/35',
                                        !notification.is_read &&
                                            'bg-primary/5',
                                    )}
                                >
                                    <div className="flex w-full items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-foreground">
                                                {notification.title}
                                            </p>
                                            {notification.sender_name && (
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    From {notification.sender_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!notification.is_read && (
                                                <span className="size-2 rounded-full bg-primary" />
                                            )}
                                            {notification.time && (
                                                <span className="shrink-0 text-[11px] text-muted-foreground">
                                                    {notification.time}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                                        {notification.message}
                                    </p>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                {notifications.length > 0 && <DropdownMenuSeparator />}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
