import { Form, Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import {
    Search,
    Stethoscope,
    UserRoundSearch,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { search as searchRoute } from '@/routes/doctor/patients';

type PatientSearchRow = {
    id: number;
    code?: string | null;
    name?: string | null;
    email?: string | null;
    profile_url: string;
};

type DoctorPatientSearchProps = {
    title: string;
    search?: string;
    patients?: PatientSearchRow[];
    stats?: Record<string, string | number>;
};

export default function PatientSearch({
    title,
    search = '',
    patients = [],
    stats = {},
}: DoctorPatientSearchProps) {
    const [searchQuery, setSearchQuery] = useState(
        search || '',
    );

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (
                searchQuery.length > 2 ||
                searchQuery.length === 0
            ) {
                router.get(
                    searchRoute.url({
                        mergeQuery: {
                            search: searchQuery,
                        },
                    }),
                    {},
                    {
                        preserveState: true,
                        replace: true,
                        only: ['patients', 'stats'],
                    },
                );
            }
        }, 300);

        return () =>
            clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const statEntries = Object.entries(stats);

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <section className="overflow-hidden rounded-lg border border-border/70 bg-gradient-to-br from-primary/18 via-primary/7 to-accent/14 p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                                <Stethoscope className="size-3.5 text-primary" />
                                Doctor workspace
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                    {title}
                                </h1>

                                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                                    Search the patient
                                    registry, open a
                                    medical file, and move
                                    directly into notes,
                                    prescriptions,
                                    analyses, and billing
                                    context.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {statEntries
                                .slice(0, 3)
                                .map(
                                    ([
                                        label,
                                        value,
                                    ]) => (
                                        <div
                                            key={label}
                                            className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm"
                                        >
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                                {label}
                                            </p>

                                            <p className="mt-2 text-2xl font-semibold text-foreground">
                                                {value}
                                            </p>
                                        </div>
                                    ),
                                )}
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader className="border-b border-border/70 bg-muted/35">
                            <CardTitle className="text-lg">
                                Patient search
                            </CardTitle>

                            <CardDescription>
                                Search by patient code,
                                name, or username.
                                Results update through a
                                normal Inertia visit.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6">
                            <Form
                                method="get"
                                className="space-y-6"
                            >
                                {({
                                    processing,
                                }) => (
                                    <>
                                        <div className="flex flex-col gap-3 md:flex-row">
                                            <div className="relative flex-1">
                                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                <Input
                                                    name="search"
                                                    value={
                                                        searchQuery
                                                    }
                                                    onChange={(
                                                        e,
                                                    ) =>
                                                        setSearchQuery(
                                                            e
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    placeholder="Search patient code, name, or username"
                                                    className="h-11 rounded-lg pl-10"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing
                                                }
                                                className="h-11 rounded-lg px-6"
                                            >
                                                {processing
                                                    ? 'Searching...'
                                                    : 'Search'}
                                            </Button>
                                        </div>

                                        {patients.length ===
                                        0 ? (
                                            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-muted/20 px-6 py-14 text-center">
                                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <UserRoundSearch className="size-5" />
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="font-medium text-foreground">
                                                        No
                                                        patients
                                                        found
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        Try a
                                                        different
                                                        patient
                                                        code,
                                                        name,
                                                        or
                                                        username.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {patients.map(
                                                    (
                                                        patient,
                                                    ) => (
                                                        <Card
                                                            key={
                                                                patient.id
                                                            }
                                                            className="group transition-colors hover:border-primary/50"
                                                        >
                                                            <CardHeader className="space-y-1 p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="font-mono text-[10px]"
                                                                    >
                                                                        {patient.code ??
                                                                            'Patient'}
                                                                    </Badge>

                                                                    <span className="text-xs text-muted-foreground">
                                                                        Patient
                                                                        #
                                                                        {
                                                                            patient.id
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                                    <UserRoundSearch className="size-4 text-primary" />

                                                                    {patient.name ??
                                                                        'Unknown patient'}
                                                                </CardTitle>

                                                                <CardDescription>
                                                                    {patient.email ??
                                                                        'No email available'}
                                                                </CardDescription>
                                                            </CardHeader>

                                                            <CardContent className="space-y-4 p-4 pt-0">
                                                                <Button
                                                                    asChild
                                                                    className="w-full rounded-lg"
                                                                >
                                                                    <Link
                                                                        href={
                                                                            patient.profile_url
                                                                        }
                                                                    >
                                                                        Open
                                                                        File
                                                                    </Link>
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Clinical overview
                                </CardTitle>

                                <CardDescription>
                                    The doctor workspace
                                    keeps the patient
                                    search and file review
                                    in one clean flow.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                {statEntries
                                    .slice(3)
                                    .map(
                                        ([
                                            label,
                                            value,
                                        ]) => (
                                            <div
                                                key={
                                                    label
                                                }
                                                className="rounded-lg border border-border/70 bg-muted/35 p-4"
                                            >
                                                <p className="font-medium text-foreground">
                                                    {
                                                        label
                                                    }
                                                </p>

                                                <p className="mt-1">
                                                    {
                                                        value
                                                    }
                                                </p>
                                            </div>
                                        ),
                                    )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}