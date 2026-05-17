import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, Bell, User, Plus, MessageSquare, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    receiver: {
        name: string;
    };
}

interface Props {
    records?: Notification[];
    actions: {
        store: string;
    };
}

export default function NotificationsPage({ records = [], actions }: Props) {
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        receiver_id: '',
        title: '',
        message: '',
    });

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter((r) =>
            r.title?.toLowerCase().includes(term) ||
            r.message?.toLowerCase().includes(term) ||
            r.receiver?.name?.toLowerCase().includes(term)
        );
    }, [search, records]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(actions.store, {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Notifications" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground">Manage and send appointment reminders to patients.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-fit">
                                <Plus className="mr-2 size-4" /> Send Reminder
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <form onSubmit={submit} className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle>Send Appointment Reminder</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to notify a patient about their scheduled appointment.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="receiver_id">Patient User ID</Label>
                                        <Input
                                            id="receiver_id"
                                            type="number"
                                            value={data.receiver_id}
                                            onChange={(e) => setData('receiver_id', e.target.value)}
                                            required
                                        />
                                        {errors.receiver_id && (
                                            <p className="text-xs text-destructive">{errors.receiver_id}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            required
                                        />
                                        {errors.title && (
                                            <p className="text-xs text-destructive">{errors.title}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            required
                                        />
                                        {errors.message && (
                                            <p className="text-xs text-destructive">{errors.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Sending...' : 'Send Notification'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient, title or message..."
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
                                        {n.receiver?.name || 'Unknown Patient'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MessageSquare className="size-3 text-primary mt-0.5" />
                                            <span className="text-muted-foreground italic">
                                                "{n.message}"
                                            </span>
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
