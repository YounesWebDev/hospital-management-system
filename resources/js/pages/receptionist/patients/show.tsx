import { Head } from '@inertiajs/react';
import { User, Mail, Phone, Fingerprint, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Patient {
    code: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

interface Props {
    title: string;
    records: Patient[];
}

export default function PatientShowPage({ title, records = [] }: Props) {
    const patient = records[0];

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <User className="size-12 text-muted-foreground/50 mb-4" />
                <h1 className="text-2xl font-semibold">Patient not found</h1>
                <p className="text-muted-foreground">The requested patient profile could not be located.</p>
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
                        <p className="text-muted-foreground">Detailed medical registration and account overview.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                Identity
                            </CardTitle>
                            <CardDescription>Basic patient identification</CardDescription>
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
                            <CardDescription>Communication channels</CardDescription>
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
                                Account Status
                            </CardTitle>
                            <CardDescription>Current system access state</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1 h-4 ${
                                        patient.status === 'active'
                                            ? 'text-green-600 border-green-200 bg-green-50'
                                            : 'text-red-600 border-red-200 bg-red-50'
                                    }`}
                                >
                                    {patient.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Verification</span>
                                <span className="flex items-center gap-1 text-xs font-medium">
                                    <BadgeCheck className="size-3 text-primary" /> Verified
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
