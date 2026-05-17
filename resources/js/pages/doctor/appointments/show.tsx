import { Head, Link } from '@inertiajs/react';
import {
    User,
    Calendar,
    FileText,
    Clock,
    ArrowLeft,
    ClipboardList,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { index } from '@/routes/doctor/appointments';

interface Appointment {
    id: number;
    patient: {
        patient_code: string;
        user: {
            name: string;
        };
    };
    type: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    notes: string;
    created_at: string;
}

interface Props {
    appointment: Appointment;
}

export default function AppointmentShowPage({ appointment }: Props) {
    return (
        <>
            <Head title={`Appointment #${appointment.id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                    >
                        <Link
                            href={index.url()}
                            className="flex items-center gap-1"
                        >
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>

                    <Badge variant="outline" className="font-mono">
                        ID: #{appointment.id}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <div className="space-y-6">
                        <Card className="border border-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Calendar className="size-5 text-primary" />
                                    </div>

                                    <div>
                                        <CardTitle className="text-xl">
                                            Appointment Details
                                        </CardTitle>

                                        <CardDescription>
                                            Scheduled date and time for the patient consultation.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Patient
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <User className="size-4 text-primary" />

                                            {appointment.patient.user.name} (
                                            {appointment.patient.patient_code})
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Appointment Date
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar className="size-4 text-primary" />

                                            {new Date(
                                                appointment.appointment_date,
                                            ).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-primary" />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Time
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <Clock className="size-4 text-primary" />
                                            {appointment.appointment_time}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Type
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <Badge variant="secondary" className="text-xs">
                                                {appointment.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-primary" />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <FileText className="size-4" />
                                        Appointment Notes
                                    </div>

                                    <div className="flex flex-col gap-1 rounded-xl border border-primary bg-card/50 p-4 transition-colors hover:bg-card/80">
                                        <p className="text-base leading-relaxed">
                                            {appointment.notes ||
                                                'No notes provided for this appointment'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border border-primary bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Quick Summary
                                </CardTitle>

                                <CardDescription>
                                    Status and summary of this appointment
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Patient:
                                        </span>

                                        <span className="font-medium">
                                            {appointment.patient.user.name}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Type:
                                        </span>

                                        <span className="font-medium">
                                            {appointment.type}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Status:
                                        </span>

                                        <Badge className="h-5 px-2 text-[10px]">
                                            {appointment.status}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator className="bg-primary" />

                                <div className="pt-2">
                                    <p className="text-xs italic text-muted-foreground">
                                        This is a scheduled clinical appointment.
                                        Please ensure the patient is notified in advance.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
