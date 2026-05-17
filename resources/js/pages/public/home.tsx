import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    CalendarDays,
    ClipboardList,
    FlaskConical,
    ReceiptText,
    ShieldCheck,
    Stethoscope,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login } from '@/routes';

const features = [
    {
        title: 'Patient files',
        description:
            'Profiles, notes, prescriptions, analyses, and billing in one record.',
        icon: ClipboardList,
    },
    {
        title: 'Clinical workflow',
        description:
            'Doctors manage appointments, prescriptions, requests, and fees.',
        icon: Stethoscope,
    },
    {
        title: 'Lab tracking',
        description:
            'Technicians process requested analyses and upload final results.',
        icon: FlaskConical,
    },
    {
        title: 'Payments',
        description:
            'Accountants record payments and keep receipt history clear.',
        icon: ReceiptText,
    },
];

const roles = [
    'Admin',
    'Receptionist',
    'Doctor',
    'Lab Technician',
    'Accountant',
    'Patient',
];

export default function Home() {
    const { auth } = usePage().props;

    // Send logged-in users to the dashboard, guests to login.
    const entryRoute = auth.user ? dashboard() : login();

    return (
        <>
            <Head title="Hospital Management System" />

            <main className="min-h-screen bg-background text-foreground">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16">
                    {/* Hero Section */}
                    <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-4">
                                <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                                    HospitalCare Operations
                                </Badge>
                                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl leading-tight">
                                    Integrated System for <span className="text-primary">Modern Healthcare</span>
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                    Streamline your clinic with a unified platform for patient registration,
                                    doctor visits, laboratory requests, and financial management.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button asChild size="lg" className="px-8">
                                    <Link href={entryRoute}>
                                        {auth.user ? 'Open Dashboard' : 'Access System'}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a href="#features">Explore Features</a>
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <Card className="relative overflow-hidden border-border/60 shadow-2xl bg-card/50 backdrop-blur-sm">
                                <CardHeader className="border-b border-border/60 bg-muted/30 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold">Live System Overview</p>
                                            <p className="text-xs text-muted-foreground">Real-time activity snapshot</p>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white animate-pulse">Live</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {[
                                            ['Patients', '128', Users],
                                            ['Appointments', '24', CalendarDays],
                                            ['Lab requests', '16', FlaskConical],
                                            ['Payments', '38', ReceiptText],
                                        ].map(([label, value, Icon]) => (
                                            <div
                                                key={label as string}
                                                className="rounded-xl border bg-background p-4 transition-all hover:border-primary/50"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {label as string}
                                                    </p>
                                                    <Icon className="size-4 text-primary" />
                                                </div>
                                                <p className="text-2xl font-bold tracking-tight">
                                                    {value as string}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 rounded-xl bg-muted/50 p-4 border border-border/40">
                                        {[
                                            'Doctor created a new appointment',
                                            'Lab technician uploaded analysis result',
                                            'Accountant processed a payment',
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 text-sm text-muted-foreground"
                                            >
                                                <ShieldCheck className="size-4 text-emerald-600" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div id="features" className="space-y-10">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight">Platform Capabilities</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                A robust suite of tools designed to handle every aspect of hospital management.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature) => (
                                <Card key={feature.title} className="group transition-all hover:-translate-y-1 hover:border-primary/50">
                                    <CardHeader className="p-6 space-y-4">
                                        <div className="p-2 rounded-lg bg-primary/10 w-fit">
                                            <feature.icon className="size-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                        <CardDescription className="text-sm leading-relaxed">
                                            {feature.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Roles Section */}
                    <div id="roles" className="border-t pt-16 space-y-10">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight">Role-Based Access Control</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Specialized interfaces for every member of the medical team.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {roles.map((role) => (
                                <Badge
                                    key={role}
                                    variant="secondary"
                                    className="rounded-full px-4 py-1.5 text-sm font-medium"
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
