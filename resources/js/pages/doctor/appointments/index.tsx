import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { create, index, show } from '@/routes/doctor/appointments';
import { Search, FileText, Plus, User, Calendar, ChevronRight, Clock, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Appointment {
    id: number;
    patient: {
        patient_code: string;
        user: { name: string };
    };
    type: string;
    status: string;
    appointment_date: string;
    appointment_time: string;
    created_at: string;
}

interface Props {
    appointments: {
        data: Appointment[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string;
    };
}

export default function AppointmentIndexPage({ appointments, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 2 || search.length === 0) {
                router.get(
                    index.url({ mergeQuery: { search } }),
                    {},
                    {
                        preserveState: true,
                        replace: true,
                        only: ['appointments', 'filters']
                    }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <>
            <Head title="Appointments" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Appointments</h1>
                        <p className="text-muted-foreground">Manage and review patient appointments.</p>
                    </div>
                    <Button asChild className="w-fit">
                        <Link href={create.url()}>
                            <Plus className="mr-2 size-4" /> Create New
                        </Link>
                    </Button>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {appointments.data.length > 0 ? (
                        appointments.data.map((appointment) => (
                            <Card key={appointment.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {appointment.patient.patient_code}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 size-3" />
                                            {new Date(appointment.appointment_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {appointment.patient.user.name}
                                    </CardTitle>
                                    <CardDescription>
                                        Appointment #{appointment.id}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Time: </span>
                                            <span className="text-muted-foreground">
                                                {appointment.appointment_time}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] px-1 h-4">
                                                {appointment.type}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] px-1 h-4">
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                        <span className="text-xs text-muted-foreground">
                                            Appointment #{appointment.id}
                                        </span>
                                        <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs group-hover:text-primary">
                                            <Link href={show.url(appointment.id)} className="flex items-center gap-1">
                                                <Eye/>
                                                View
                                                <ChevronRight className="size-3" />
                                            </Link>
                                        </Button>
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

                {appointments.links.length > 3 && (
                    <div className="flex justify-center gap-2 py-4">
                        {appointments.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                                className="text-xs"
                            >
                                {link.url ? <Link href={link.url}>{link.label}</Link> : link.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
