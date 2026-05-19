import { Head, router } from '@inertiajs/react';
import {
    Search,
    FileText,
    Calendar,
    Clock,
    User,
    Stethoscope,
    BellRing,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/receptionist/notifications';

interface Appointment {
    id: number;
    patient: string;
    patient_user_id: number;
    doctor: string;
    date: string;
    time: string;
    status: string;
    is_soon: boolean;
    is_notified: boolean;
}

interface Props {
    records?: Appointment[];
}

export default function AppointmentIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState<{
        id: number;
        name: string;
    } | null>(null);

    const [message, setMessage] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();

        if (term.length < 2) return records;

        return records.filter(
            (r) =>
                r.patient?.toLowerCase().includes(term) ||
                r.doctor?.toLowerCase().includes(term) ||
                r.status?.toLowerCase().includes(term)
        );
    }, [search, records]);

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPatient) return;

        router.post(
            store.url(),
            {
                receiver_id: selectedPatient.id,
                title: 'Appointment Reminder',
                message,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setMessage('');
                    setSelectedPatient(null);

                    // Reload page to refresh notification status
                    router.reload();
                },
            }
        );
    };

    return (
        <>
            <Head title="Appointments" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Appointments
                        </h1>

                        <p className="text-muted-foreground">
                            Manage and review scheduled patient appointments.
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />

                        <Input
                            placeholder="Search by patient, doctor or status..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((appointment) => (
                            <Card
                                key={appointment.id}
                                className="group transition-colors hover:border-primary/50"
                            >
                                <CardHeader className="space-y-2 p-4">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-[10px]"
                                        >
                                            Appointment
                                        </Badge>

                                        <div className="flex items-center gap-2">
                                            {appointment.is_soon && (
                                                <Badge
                                                    variant="destructive"
                                                    className="animate-pulse text-[10px]"
                                                >
                                                    Soon
                                                </Badge>
                                            )}

                                            <span className="flex items-center text-xs text-muted-foreground">
                                                <Calendar className="mr-1 size-3" />

                                                {appointment.date
                                                    ? new Date(
                                                          appointment.date
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />

                                        {appointment.patient ||
                                            'Unknown Patient'}
                                    </CardTitle>

                                    <CardDescription>
                                        Assigned to:{' '}
                                        {appointment.doctor ||
                                            'Not Assigned'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="size-3 text-primary" />

                                            <span className="font-medium">
                                                Doctor:
                                            </span>

                                            <span className="text-muted-foreground">
                                                {appointment.doctor || 'N/A'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="size-3 text-primary" />

                                            <span className="font-medium">
                                                Time:
                                            </span>

                                            <span className="text-muted-foreground">
                                                {appointment.time || 'N/A'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                Status:
                                            </span>

                                            <Badge
                                                className={`h-5 px-2 text-[10px] capitalize text-white ${
                                                    appointment.status ===
                                                    'completed'
                                                        ? 'bg-green-500'
                                                        : appointment.status ===
                                                            'cancelled'
                                                          ? 'bg-red-500'
                                                          : appointment.status ===
                                                              'pending'
                                                            ? 'bg-orange-500'
                                                            : 'bg-blue-500'
                                                }`}
                                            >
                                                {appointment.status || 'N/A'}
                                            </Badge>
                                        </div>

                                        {appointment.is_notified && (
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-600 text-white text-[10px]">
                                                    Patient Already Notified
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        {appointment.status === 'scheduled' &&
                                            !appointment.is_notified && (
                                                <Dialog
                                                    open={
                                                        open &&
                                                        selectedPatient?.id ===
                                                            appointment.patient_user_id
                                                    }
                                                    onOpenChange={(value) => {
                                                        setOpen(value);

                                                        if (!value) {
                                                            setMessage('');
                                                            setSelectedPatient(
                                                                null
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex w-full items-center gap-2 sm:w-auto"
                                                            onClick={() =>
                                                                setSelectedPatient(
                                                                    {
                                                                        id: appointment.patient_user_id,
                                                                        name: appointment.patient,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <BellRing className="size-3" />

                                                            Notify Patient
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent>
                                                        <form
                                                            onSubmit={
                                                                handleNotify
                                                            }
                                                            className="space-y-4"
                                                        >
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Notify
                                                                    Patient
                                                                </DialogTitle>

                                                                <DialogDescription>
                                                                    Send a
                                                                    reminder
                                                                    message to{' '}
                                                                    {
                                                                        appointment.patient
                                                                    }
                                                                    .
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="grid gap-2">
                                                                <Label htmlFor="message">
                                                                    Reminder
                                                                    Message
                                                                </Label>

                                                                <Textarea
                                                                    id="message"
                                                                    placeholder="e.g. Your appointment is scheduled for tomorrow at 10:00 AM."
                                                                    value={
                                                                        message
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setMessage(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    required
                                                                />
                                                            </div>

                                                            <DialogFooter>
                                                                <Button type="submit">
                                                                    Send
                                                                    Notification
                                                                </Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full rounded-lg border bg-muted/20 py-12 text-center">
                            <FileText className="mx-auto mb-3 size-12 text-muted-foreground/50" />

                            <p className="text-muted-foreground">
                                No appointments found matching your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}