import { Head, Link } from '@inertiajs/react';
import { Search, FileText, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';

interface Appointment {
    patient: string;
    doctor: string;
    date: string;
    time: string;
    status: string;
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
            r.patient?.toLowerCase().includes(term) ||
            r.doctor?.toLowerCase().includes(term) ||
            r.status?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="Appointments" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Appointments</h1>
                        <p className="text-muted-foreground">Manage and review scheduled patient appointments.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient or doctor..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((appointment, index) => (
                            <Card key={index} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            Appointment
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 size-3" />
                                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {appointment.patient || 'Unknown Patient'}
                                    </CardTitle>
                                    <CardDescription>
                                        Assigned to: {appointment.doctor || 'Not Assigned'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Doctor: </span>
                                            <span className="text-muted-foreground">
                                                {appointment.doctor || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Time: </span>
                                            <span className="text-muted-foreground">
                                                {appointment.time || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] px-1 h-4">
                                                {appointment.status || 'N/A'}
                                            </Badge>
                                        </div>
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
