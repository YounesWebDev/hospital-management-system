import { Head, Link } from '@inertiajs/react';
import { Search, FileText, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';

interface Appointment {
    id: number;
    patient: {
        patient_code: string;
        user: { name: string };
    };
    doctor: {
        name: string;
    };
    type: string;
    status: string;
    appointment_date: string;
    appointment_time: string;
    created_at: string;
}

interface Props {
    records?: Appointment[];
}

export default function AppointmentIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.patient?.user?.name?.toLowerCase().includes(term) ||
            r.patient?.patient_code?.toLowerCase().includes(term) ||
            r.doctor?.name?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="Appointments" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Appointments</h1>
                        <p className="text-muted-foreground">Comprehensive overview of all patient appointments and their assigned doctors.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient, doctor, or code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((appointment) => (
                            <Card key={appointment.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {appointment.patient?.patient_code || 'N/A'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 size-3" />
                                            {appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {appointment.patient?.user?.name || 'Unknown Patient'}
                                    </CardTitle>
                                    <CardDescription>
                                        Appointment #{appointment.id}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Doctor: </span>
                                            <span className="text-muted-foreground">
                                                {appointment.doctor?.name || 'Not Assigned'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Time: </span>
                                            <span className="text-muted-foreground">
                                                {appointment.appointment_time || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] px-1 h-4">
                                                {appointment.type || 'N/A'}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] px-1 h-4">
                                                {appointment.status || 'N/A'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                        <span className="text-xs text-muted-foreground">
                                            Ref ID: {appointment.id}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <FileText className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No appointments found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
