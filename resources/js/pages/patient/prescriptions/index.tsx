import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, FileText, Pill, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Prescription {
    id: number;
    medicine: string;
    doctor: string;
    diagnosis: string;
    instructions: string;
    created_at: string;
    items: Array<{
        name: string;
        dosage: string;
        duration: string;
    }>;
}

interface Props {
    prescriptions?: Prescription[];
}

export default function PrescriptionIndexPage({ prescriptions = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return prescriptions;
        return prescriptions.filter(r =>
            r.medicine?.toLowerCase().includes(term) ||
            r.doctor?.toLowerCase().includes(term) ||
            r.diagnosis?.toLowerCase().includes(term)
        );
    }, [search, prescriptions]);

    return (
        <>
            <Head title="My Prescriptions" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">My Prescriptions</h1>
                        <p className="text-muted-foreground">Review your medications and treatment instructions.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by medicine, doctor or diagnosis..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((prescription) => (
                            <Card key={prescription.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            Prescription
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="mr-1 size-3" />
                                            {prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Pill className="size-4 text-primary" />
                                        {prescription.medicine || 'Medication'}
                                    </CardTitle>
                                    <CardDescription>
                                        Prescribed by: {prescription.doctor || 'TBD'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Diagnosis: </span>
                                            <span className="text-muted-foreground italic">
                                                {prescription.diagnosis || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Instructions: </span>
                                            <span className="text-muted-foreground">
                                                {prescription.instructions || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <Pill className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No prescriptions found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
