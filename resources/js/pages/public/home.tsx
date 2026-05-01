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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login } from '@/routes';

// Main feature cards shown on the public home page.
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

// Simple role list. Permissions are added later in the project plan.
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
                <section className="border-b bg-muted/30">
                    <div className="mx-auto grid min-h-[88vh] w-full max-w-7xl grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
                        <div className="flex flex-col gap-8">
                            <nav className="flex items-center justify-between gap-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 text-sm font-semibold"
                                >
                                    <span className="flex size-9 items-center justify-center rounded-md bg-teal-600 text-white">
                                        <Activity className="size-5" />
                                    </span>
                                    HospitalCare
                                </Link>

                                <Button asChild variant="outline" size="sm">
                                    <Link href={entryRoute}>
                                        {auth.user ? 'Dashboard' : 'Log in'}
                                    </Link>
                                </Button>
                            </nav>

                            <div className="max-w-2xl space-y-6">
                                <Badge className="w-fit bg-teal-600 text-white hover:bg-teal-600">
                                    Clinic operations
                                </Badge>
                                <div className="space-y-4">
                                    <h1 className="text-4xl leading-tight font-semibold tracking-normal sm:text-5xl">
                                        Hospital management system for daily
                                        patient care.
                                    </h1>
                                    <p className="max-w-xl text-base leading-7 text-muted-foreground">
                                        Manage staff, patient registration,
                                        doctor visits, lab requests, billing,
                                        payments, and patient portal access from
                                        one Laravel and React application.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        asChild
                                        className="bg-teal-600 hover:bg-teal-700"
                                    >
                                        <Link href={entryRoute}>
                                            {auth.user
                                                ? 'Open dashboard'
                                                : 'Log in to system'}
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <a href="#roles">View roles</a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="text-sm font-medium">Today</p>
                                    <p className="text-xs text-muted-foreground">
                                        Clinic activity overview
                                    </p>
                                </div>
                                <Badge variant="secondary">Live</Badge>
                            </div>

                            <div className="grid gap-3 py-4 sm:grid-cols-2">
                                {[
                                    ['Patients', '128', Users],
                                    ['Appointments', '24', CalendarDays],
                                    ['Lab requests', '16', FlaskConical],
                                    ['Payments', '38', ReceiptText],
                                ].map(([label, value, Icon]) => (
                                    <div
                                        key={label as string}
                                        className="rounded-md border bg-background p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                {label as string}
                                            </p>
                                            <Icon className="size-4 text-teal-600" />
                                        </div>
                                        <p className="mt-3 text-2xl font-semibold">
                                            {value as string}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 rounded-md bg-muted/50 p-4">
                                {[
                                    'Doctor created an appointment',
                                    'Lab uploaded an analysis result',
                                    'Accountant recorded a payment',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        <ShieldCheck className="size-4 text-emerald-600" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <Card key={feature.title} className="rounded-lg">
                                <CardHeader>
                                    <feature.icon className="size-5 text-teal-600" />
                                    <CardTitle className="text-base">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-6 text-muted-foreground">
                                    {feature.description}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section
                    id="roles"
                    className="border-t bg-muted/30 px-6 py-12 lg:px-8"
                >
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Role-based access
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Each team member sees only the workflow they
                                need.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <Badge
                                    key={role}
                                    variant="outline"
                                    className="rounded-md px-3 py-1.5"
                                >
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
