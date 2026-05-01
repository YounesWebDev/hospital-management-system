import { Form, Head, Link } from '@inertiajs/react';
import { Activity, ArrowLeft, ClipboardList, FlaskConical, NotebookPen, ReceiptText } from 'lucide-react';
import { PrescriptionCard } from '@/components/hospital/prescription-card';
import InputError from '@/components/input-error';
import { AnalysisStatusBadge } from '@/components/hospital/analysis-status-badge';
import { StatusBadge } from '@/components/hospital/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type PatientSummary = {
    notes: number;
    prescriptions: number;
    analyses: number;
    appointments: number;
    billing: number;
};

type PatientHeader = {
    id: number;
    code?: string | null;
    name?: string | null;
    email?: string | null;
    username?: string | null;
};

type MedicalNoteRow = {
    id: number;
    note: string;
    doctor?: string | null;
    created_at?: string | null;
};

type PrescriptionRow = {
    id: number;
    medicine?: string | null;
    diagnosis?: string | null;
    instructions?: string | null;
    created_at?: string | null;
    doctor?: string | null;
    items: Array<{
        name?: string | null;
        dosage?: string | null;
        duration?: string | null;
    }>;
};

type AnalysisRow = {
    id: number;
    type?: string | null;
    status?: string | null;
    requested_at?: string | null;
    result?: string | null;
};

type AppointmentRow = {
    id: number;
    type?: string | null;
    date?: string | null;
    time?: string | null;
    status?: string | null;
    notes?: string | null;
};

type BillingRow = {
    id: number;
    total?: string | number | null;
    paid?: string | number | null;
    remaining?: string | number | null;
    status?: string | null;
    item_count?: number | null;
};

type DoctorPatientShowProps = {
    title: string;
    patient: PatientHeader;
    summary: PatientSummary;
    medicalNotes: MedicalNoteRow[];
    prescriptions: PrescriptionRow[];
    analyses: AnalysisRow[];
    appointments: AppointmentRow[];
    billingRecords: BillingRow[];
    actions: {
        note: string;
        back: string;
    };
};

export default function PatientShow({
    title,
    patient,
    summary,
    medicalNotes,
    prescriptions,
    analyses,
    appointments,
    billingRecords,
    actions,
}: DoctorPatientShowProps) {
    const statCards = [
        { label: 'Notes', value: summary.notes, icon: NotebookPen },
        { label: 'Prescriptions', value: summary.prescriptions, icon: ClipboardList },
        { label: 'Analyses', value: summary.analyses, icon: FlaskConical },
        { label: 'Billing', value: summary.billing, icon: ReceiptText },
    ];

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <section className="overflow-hidden rounded-lg border border-border/70 bg-gradient-to-br from-primary/18 via-primary/6 to-accent/14 p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <Button asChild variant="outline" className="rounded-lg bg-background/80">
                                <Link href={actions.back} className="gap-2">
                                    <ArrowLeft className="size-4" />
                                    Back to patient search
                                </Link>
                            </Button>
                            <div className="space-y-2">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    {patient.code ?? 'Patient file'}
                                </p>
                                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                    {patient.name ?? 'Patient medical file'}
                                </h1>
                                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                                    Review the patient history, add a clinical note, and scan the latest treatment,
                                    analysis, appointment, and billing activity.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Email
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {patient.email ?? 'Not available'}
                                </p>
                            </div>
                            <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Username
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {patient.username ?? 'Not available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(({ label, value, icon: Icon }) => (
                        <Card key={label} className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                            <CardContent className="flex items-center justify-between p-5">
                                <div>
                                    <p className="text-sm text-muted-foreground">{label}</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
                                </div>
                                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="space-y-6">
                        <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Medical notes</CardTitle>
                                <CardDescription>
                                    A quick timeline of the clinical notes currently stored for this patient.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {medicalNotes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No medical notes have been added yet.</p>
                                ) : (
                                    medicalNotes.map((note) => (
                                        <div key={note.id} className="rounded-lg border border-border/70 bg-muted/25 p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-medium text-foreground">
                                                    {note.doctor ?? 'Doctor note'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {note.created_at ?? ''}
                                                </p>
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{note.note}</p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 xl:grid-cols-2">
                            <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Prescriptions</CardTitle>
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

                            <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Analysis requests</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {analyses.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No analysis requests available.</p>
                                    ) : (
                                        analyses.map((analysis) => (
                                            <div key={analysis.id} className="rounded-lg border border-border/70 bg-muted/25 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="font-medium text-foreground">{analysis.type ?? 'Analysis'}</p>
                                                    <AnalysisStatusBadge status={analysis.status} />
                                                </div>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Requested on {analysis.requested_at ?? 'unknown date'}
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    {analysis.result ?? 'No result uploaded yet.'}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-2">
                            <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Appointments</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {appointments.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No appointments recorded.</p>
                                    ) : (
                                        appointments.map((appointment) => (
                                            <div key={appointment.id} className="rounded-lg border border-border/70 bg-muted/25 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="font-medium text-foreground capitalize">
                                                        {appointment.type ?? 'Appointment'}
                                                    </p>
                                                    <StatusBadge status={appointment.status} />
                                                </div>
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {appointment.date ?? 'No date'} at {appointment.time ?? 'No time'}
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    {appointment.notes ?? 'No appointment notes.'}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Billing records</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {billingRecords.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No billing records recorded.</p>
                                    ) : (
                                        billingRecords.map((billing) => (
                                            <div key={billing.id} className="rounded-lg border border-border/70 bg-muted/25 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="font-medium text-foreground">
                                                        ${billing.total ?? 0} total
                                                    </p>
                                                    <StatusBadge status={billing.status} />
                                                </div>
                                                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                                                    <p>Paid: ${billing.paid ?? 0}</p>
                                                    <p>Remaining: ${billing.remaining ?? 0}</p>
                                                    <p>Items: {billing.item_count ?? 0}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Activity className="size-4 text-primary" />
                                    <CardTitle className="text-base">Add a new note</CardTitle>
                                </div>
                                <CardDescription>
                                    Save a concise medical note directly to the patient file.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form action={actions.note} method="post" className="grid gap-4">
                                    {({ errors, processing }) => (
                                        <>
                                            <input type="hidden" name="patient_id" value={patient.id} />
                                            <div className="grid gap-2">
                                                <Label htmlFor="note">Medical note</Label>
                                                <Textarea
                                                    id="note"
                                                    name="note"
                                                    required
                                                    className="min-h-36 rounded-lg"
                                                />
                                                <InputError message={errors.note} />
                                            </div>
                                            <Button type="submit" disabled={processing} className="rounded-lg">
                                                {processing ? 'Saving note...' : 'Save note'}
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
