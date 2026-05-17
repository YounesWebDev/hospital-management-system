import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, FileText, Calendar, ChevronRight, Eye, User, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Props {
    records?: BillingRecord[];
}

export default function BillingIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.patient?.user?.name?.toLowerCase().includes(term) ||
            r.patient?.patient_code?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="Billing Report" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Billing Report</h1>
                        <p className="text-muted-foreground">Monitor and review all financial billing records for patients.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient name or code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((record) => (
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
                                            {record.patient?.patient_code || 'N/A'}
                                        </Badge>
                                        <span className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="mr-1 size-3" />
                                            {record.created_at ? new Date(record.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {record.patient?.user?.name || 'Unknown Patient'}
                                    </CardTitle>
                                    <CardDescription>
                                        Billing Record #{record.id}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">
                                                Total Amount:
                                            </span>
                                            <span className="text-muted-foreground">
                                                {record.total_amount || '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="size-3 text-muted-foreground" />
                                            <span className="font-medium text-foreground">
                                                Remaining:
                                            </span>
                                            <span className="text-muted-foreground">
                                                {record.remaining_amount || '0.00'}
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
                                                    : record.status || 'Unpaid'
                                            }
                                        </Badge>
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
            </div>
        </>
    );
}
