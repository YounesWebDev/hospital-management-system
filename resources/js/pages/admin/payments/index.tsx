import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, FileText, Calendar, ChevronRight, Eye, User, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Payment {
    id: number;
    billing: {
        billing_code: string;
        patient: {
            user: { name: string };
        };
    };
    amount: string;
    payment_date: string;
    payment_method: string;
    status: string;
    created_at: string;
}

interface Props {
    records?: Payment[];
}

export default function PaymentsIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.billing?.patient?.user?.name?.toLowerCase().includes(term) ||
            r.billing?.billing_code?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="Payments Report" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Payments Report</h1>
                        <p className="text-muted-foreground">Review all patient payments and financial transactions.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient or billing code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((payment) => (
                            <Card
                                key={payment.id}
                                className="group transition-colors hover:border-primary/50"
                            >
                                <CardHeader className="space-y-1 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="mr-1 size-3" />
                                            {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {payment.billing?.patient?.user?.name || 'Unknown Patient'}
                                    </CardTitle>
                                    <CardDescription>
                                        Payment Record #{payment.id}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">
                                                Amount:
                                            </span>
                                            <span className="text-muted-foreground">
                                                {payment.amount || '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">
                                                Method:
                                            </span>
                                            <span className="text-muted-foreground">
                                                {payment.payment_method || 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                        <Badge
                                            className={`capitalize ${
                                                payment.status === 'completed'
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        >
                                            {payment.status || 'Unknown'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full rounded-lg border bg-muted/20 py-12 text-center">
                            <FileText className="mx-auto mb-3 size-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                                No payments found matching your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
