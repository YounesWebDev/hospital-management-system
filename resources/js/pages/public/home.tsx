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
                                    Integrated System for <span className="text-primary block">Modern Healthcare</span>
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
                </div>
            </main>
        </>
    );
}
