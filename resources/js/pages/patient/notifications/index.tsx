import { Form, Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, Bell, User, Clock, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notification {
    id: number;
    title: string;
    message: string;
    sender: string;
    created_at: string;
    is_read: boolean;
}

interface Props {
    records?: Notification[];
    actions?: {
        markAsRead: string;
    };
}

export default function PatientNotificationsPage({ records = [], actions = {} }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.title?.toLowerCase().includes(term) ||
            r.message?.toLowerCase().includes(term) ||
            r.sender?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="My Notifications" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">My Notifications</h1>
                        <p className="text-muted-foreground">Read reminders and system messages.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, message or sender..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((n) => (
                            <Card key={n.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            Notification
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="mr-1 size-3" />
                                            {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bell className="size-4 text-primary" />
                                        {n.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <User className="size-3" />
                                        From: {n.sender || 'System'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <p className="text-muted-foreground italic">
                                                "{n.message}"
                                            </p>
                                        </div>
                                        <div className="flex justify-end pt-2 border-t border-border/50">
                                            {!n.is_read && (
                                                <Form
                                                    action={`${actions.markAsRead}/${n.id}`}
                                                    method="post"
                                                >
                                                    {({ processing }) => (
                                                        <Button
                                                            type="submit"
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 px-2 text-[11px]"
                                                            disabled={processing}
                                                        >
                                                            <CheckCircle className="mr-1 size-3" /> Mark Read
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <Bell className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No notifications found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
