import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, Receipt, Clock, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BillingRecord {
    id: number;
    amount: string | number;
    status: string;
    created_at: string;
    description: string;
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
            r.description?.toLowerCase().includes(term) ||
            r.status?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="My Billing" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">My Billing</h1>
                        <p className="text-muted-foreground">Review your medical bills and outstanding payments.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by description or status..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((record) => (
                            <Card key={record.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            Bill
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="mr-1 size-3" />
                                            {record.created_at ? new Date(record.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Receipt className="size-4 text-primary" />
                                        ${record.amount}
                                    </CardTitle>
                                    <CardDescription>
                                        Billing ID: {record.id}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Status: </span>
                                            <Badge variant="outline" className="text-[10px] px-1 h-4">
                                                {record.status || 'N/A'}
                                            </Badge>
                                        </div>
                                        <div className="pt-2 border-t border-border/50">
                                            <p className="text-xs text-muted-foreground italic">
                                                {record.description || 'No description provided.'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <Receipt className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No bills found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
