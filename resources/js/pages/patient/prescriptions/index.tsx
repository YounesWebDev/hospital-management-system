import { Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PrescriptionRow = {
    id: number;
    medicine?: string | null;
    doctor?: string | null;
    diagnosis?: string | null;
    instructions?: string | null;
    created_at?: string | null;
    items: Array<{
        name?: string | null;
        dosage?: string | null;
        duration?: string | null;
    }>;
};

type PatientPrescriptionsProps = {
    title: string;
    prescriptions?: PrescriptionRow[];
};

export default function PatientPrescriptions({
    title,
    prescriptions = [],
}: PatientPrescriptionsProps) {
    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <section className="overflow-hidden rounded-lg border border-border/70 bg-gradient-to-br from-primary/16 via-primary/6 to-accent/12 p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl space-y-2">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                                <ClipboardList className="size-3.5 text-primary" />
                                Patient records
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
                            <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                                Review the medicine name, the doctor who prescribed it, and the current instructions.
                            </p>
                        </div>

                        <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                Prescriptions
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-foreground">{prescriptions.length}</p>
                        </div>
                    </div>
                </section>

                <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Prescription list</CardTitle>
                        <CardDescription>
                            Each prescription keeps the medicine name separate from the prescribing doctor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {prescriptions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No prescriptions available.</p>
                        ) : (
                            prescriptions.map((prescription) => (
                                <div key={prescription.id} className="rounded-lg border border-border/70 bg-muted/25 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-medium text-foreground">
                                            {prescription.medicine ?? 'Prescription'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {prescription.created_at ?? ''}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Prescribed by {prescription.doctor ?? 'Unknown doctor'}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Diagnosis: {prescription.diagnosis ?? 'No diagnosis recorded.'}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {prescription.instructions ?? 'No instructions recorded.'}
                                    </p>
                                    <div className="mt-3 space-y-2">
                                        {prescription.items.map((item, index) => (
                                            <div key={index} className="rounded-md border border-border/60 bg-background/80 px-3 py-2 text-sm">
                                                <span className="font-medium text-foreground">{item.name ?? 'Medicine'}</span>
                                                <span className="text-muted-foreground">
                                                    {' '}• {item.dosage ?? 'No dosage'} • {item.duration ?? 'No duration'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
