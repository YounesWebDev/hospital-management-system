import { Head } from '@inertiajs/react';
import { User, Mail, Phone, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Patient {
    code: string;
    name: string;
    email: string;
    phone: string;
}

interface Props {
    title: string;
    records: Patient[];
}

export default function PatientProfilePage({ title, records = [] }: Props) {
    const patient = records[0];

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <User className="size-12 text-muted-foreground/50 mb-4" />
                <h1 className="text-2xl font-semibold">Profile not found</h1>
                <p className="text-muted-foreground">The requested profile could not be located.</p>
            </div>
        );
    }

    return (
        <>
            <Head title={title} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold tracking-tight">{patient.name}</h1>
                            <Badge variant="outline" className="font-mono text-xs">
                                {patient.code}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">Your personal medical registration and account details.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                Identity
                            </CardTitle>
                            <CardDescription>Personal identification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Full Name</span>
                                <span className="font-medium">{patient.name}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Patient Code</span>
                                <span className="font-mono font-medium">{patient.code}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Mail className="size-4 text-primary" />
                                Contact
                            </CardTitle>
                            <CardDescription>Communication details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">{patient.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Phone</span>
                                <span className="font-medium">{patient.phone || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="size-4 text-primary" />
                                Account
                            </CardTitle>
                            <CardDescription>System access state</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Verification</span>
                                <span className="flex items-center gap-1 text-xs font-medium">
                                    <BadgeCheck className="size-3 text-primary" /> Verified Patient
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
