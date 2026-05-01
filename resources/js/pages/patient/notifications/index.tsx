import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type NotificationRecord = {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
};

export default function PatientNotifications({
    records = [],
    actions = {},
}: {
    records?: NotificationRecord[];
    actions?: {
        readBase?: string;
    };
}) {
    const readBase = actions.readBase ?? '/patient/notifications';

    return (
        <>
            <Head title="My Notifications" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">My Notifications</h1>
                    <p className="text-sm text-muted-foreground">
                        Read reminders and system messages.
                    </p>
                </div>

                <div className="grid gap-4">
                    {records.length === 0 ? (
                        <Card className="rounded-lg">
                            <CardContent className="pt-6 text-sm text-muted-foreground">
                                No notifications yet.
                            </CardContent>
                        </Card>
                    ) : (
                        records.map((notification) => (
                            <Card key={notification.id} className="rounded-lg">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {notification.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <p className="text-sm text-muted-foreground">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs uppercase text-muted-foreground">
                                            {notification.type}
                                        </span>
                                        {!notification.is_read && (
                                            <Form
                                                action={`${readBase}/${notification.id}/read`}
                                                method="post"
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        disabled={processing}
                                                    >
                                                        Mark read
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
