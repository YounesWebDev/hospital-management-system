import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import { index, show, create } from '@/routes/doctor/billing';

import {
    Search,
    FileText,
    Plus,
    User,
    Calendar,
    ChevronRight,
    Eye
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BillingRecord {
    id: number;
    patient: {
        patient_code: string;
        user: {
            name: string;
        };
    };
    total_amount: string;
    remaining_amount: string;
    status: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    billing: {
        data: BillingRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };

    filters: {
        search: string;
    };
}

export default function BillingIndexPage({
    billing,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 2 || search.length === 0) {
                router.get(
                    index.url({
                        mergeQuery: { search },
                    }),
                    {},
                    {
                        preserveState: true,
                        replace: true,
                        only: ['billing', 'filters'],
                    },
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <>
            <Head title="Billing" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Billing
                        </h1>

                        <p className="text-muted-foreground">
                            Manage and review patient billing records.
                        </p>
                    </div>

                    <Button asChild className="w-fit">
                        <Link href={create.url()}>
                            <Plus className="mr-2 size-4" />
                            Create New Item
                        </Link>
                    </Button>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />

                    <Input
                        placeholder="Search by name or code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {billing.data.length > 0 ? (
                        billing.data.map((record) => (
                            <Card
                                key={record.id}
                                className="group transition-colors hover:border-primary/50"
                            >
                                <CardHeader className="space-y-1 p-4">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-[10px]"
                                        >
                                            {record.patient.patient_code}
                                        </Badge>

                                        <span className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="mr-1 size-3" />

                                            {new Date(
                                                record.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />

                                        {record.patient.user.name}
                                    </CardTitle>

                                    <CardDescription>
                                        Billing Record #{record.id}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium text-foreground">
                                                Total Amount:{' '}
                                            </span>

                                            <span className="text-muted-foreground">
                                                {record.total_amount}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="font-medium text-foreground">
                                                Remaining:{' '}
                                            </span>

                                            <span className="text-muted-foreground">
                                                {record.remaining_amount}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                        <Badge
                                            
                                            className={`capitalize ${
                                                record.status === 'paid'
                                                    ? 'bg-green-500'
                                                    : record.status === 'partially_paid'
                                                    ? 'bg-orange-500'
                                                    : 'bg-red-500'
                                            }`}
                                        >
                                            {
                                                record.status === 'paid'
                                                    ? 'Paid'
                                                    : record.status === 'partially_paid'
                                                    ? 'Partially Paid'
                                                    : 'Unpaid'
                                            }
                                        </Badge>

                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs group-hover:text-primary"
                                        >
                                            <Link
                                                href={show.url(record.id)}
                                                className="flex items-center gap-1"
                                            >
                                                <Eye/>

                                                View

                                                <ChevronRight className="size-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full rounded-lg border bg-muted/20 py-12 text-center">
                            <FileText className="mx-auto mb-3 size-12 text-muted-foreground/50" />

                            <p className="text-muted-foreground">
                                No billing records found matching your search.
                            </p>
                        </div>
                    )}
                </div>

                {billing.links.length > 3 && (
                    <div className="flex justify-center gap-2 py-4">
                        {billing.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={
                                    link.active
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                                className="text-xs"
                            >
                                {link.url ? (
                                    <Link href={link.url}>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}