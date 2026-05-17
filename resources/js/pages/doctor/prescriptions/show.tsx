import { Head, Link } from '@inertiajs/react';
import {
    User,
    Calendar,
    FileText,
    Pill,
    ArrowLeft,
    ClipboardList,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { index } from '@/routes/doctor/prescriptions';

interface PrescriptionItem {
    id: number;
    medicine_name: string;
    dosage: string;
    duration: string;
    instructions: string;
}

interface Prescription {
    id: number;
    patient: {
        patient_code: string;
        user: {
            name: string;
        };
    };
    diagnosis: string;
    instructions: string;
    created_at: string;
    items: PrescriptionItem[];
}

interface Props {
    prescription: Prescription;
}

export default function PrescriptionShowPage({ prescription }: Props) {
    return (
        <>
            <Head title={`Prescription #${prescription.id}`} />

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
                            className="flex items-center hover:text-primary gap-1"
                        >
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>

                    <Badge variant="outline" className="font-mono">
                        ID: #{prescription.id}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <div className="space-y-6">
                        <Card className="border border-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <FileText className="size-5 text-primary" />
                                    </div>

                                    <div>
                                        <CardTitle className="text-xl">
                                            Prescription Details
                                        </CardTitle>

                                        <CardDescription>
                                            Medical instructions and prescribed
                                            medications for {prescription.patient.user.name}.
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

                                            {prescription.patient.user.name} (
                                            {prescription.patient.patient_code})
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar className="size-4 text-primary" />

                                            {new Date(
                                                prescription.created_at,
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

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <ClipboardList className="size-4 text-primary" />
                                        Diagnosis
                                    </div>

                                    <div className="flex flex-col gap-1 rounded-xl border border-primary bg-card/50 p-4 transition-colors hover:bg-card/80">
                                        <p className="text-base leading-relaxed">
                                            {prescription.diagnosis ||
                                                'No diagnosis recorded'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <FileText className="size-4 text-primary" />
                                        General Instructions
                                    </div>

                                    <div className="flex flex-col gap-1 rounded-xl border border-primary bg-card/50 p-4 transition-colors hover:bg-card/80">
                                        <p className="text-base leading-relaxed">
                                            {prescription.instructions ||
                                                'No general instructions provided'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Pill className="size-5 text-primary" />
                                    </div>

                                    <CardTitle className="text-lg">
                                        Prescribed Medicines
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid gap-4">
                                    {prescription.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-3 rounded-xl border border-primary bg-card/50 p-4 transition-colors hover:bg-card/80"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-lg font-semibold">
                                                    <Pill className="size-4 text-primary" />
                                                    {item.medicine_name}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                                                <div className="space-y-1">
                                                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        Dosage
                                                    </span>

                                                    <span className="font-medium">
                                                        {item.dosage || 'N/A'}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        Duration
                                                    </span>

                                                    <span className="font-medium">
                                                        {item.duration || 'N/A'}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        Instructions
                                                    </span>

                                                    <span className="font-medium">
                                                        {item.instructions ||
                                                            'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {prescription.items.length === 0 && (
                                        <div className="py-8 text-center italic text-muted-foreground">
                                            No medicines listed in this
                                            prescription.
                                        </div>
                                    )}
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
                                    Summary of this prescription
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Patient:
                                        </span>

                                        <span className="font-medium">
                                            {prescription.patient.user.name}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Items:
                                        </span>

                                        <span className="font-medium">
                                            {prescription.items.length}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Status:
                                        </span>

                                        <Badge className="h-5 px-2 text-[10px] bg-green-500 text-white">
                                            Active
                                        </Badge>
                                    </div>
                                </div>

                                <Separator className="bg-primary" />

                                <div className="pt-2">
                                    <p className="text-xs italic text-muted-foreground">
                                        This is an official medical document
                                        created by the hospital management
                                        system.
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
