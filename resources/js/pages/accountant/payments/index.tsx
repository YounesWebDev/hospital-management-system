import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, Banknote, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import receipts from "@/routes/accountant/receipts";
interface Payment {
    id: number;
    amount: string | number;
    date: string;
    method: string;
    patient: string;
    receipt: string;
    status: string;
}

interface Props {
    records?: Payment[];
}

export default function PaymentIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.method?.toLowerCase().includes(term) ||
            r.patient?.toLowerCase().includes(term) ||
            r.status?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="Payment History" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Payment History</h1>
                        <p className="text-muted-foreground">Review and track all patient payments recorded in the system.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient, method or status..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((payment) => (
                            <Card key={payment.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            Payment
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="mr-1 size-3" />
                                            {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Banknote className="size-4 text-primary" />
                                        ${payment.amount}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <User className="size-3" />
                                        {payment.patient || 'Unknown Patient'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">Method: </span>
                                            <span className="text-muted-foreground capitalize">
                                                {payment.method || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] px-1 h-4">
                                                {payment.status || 'N/A'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="pt-3 flex justify-end border-t border-border/50">
                                        <Button asChild variant="outline" size="sm" className="h-7 px-2 text-[11px]">
                                            <Link href={receipts.show({ payment: payment.id }).url}>
                                                View Receipt
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <Banknote className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No payments found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
