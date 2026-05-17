import { Head, Link } from '@inertiajs/react';
import { ReceiptText, User, CreditCard, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BillingDetails {
    id: number;
    patient: string;
    total: string | number;
    paid: string | number;
    remaining: string | number;
    status: string;
}

interface Props {
    title: string;
    records: BillingDetails[];
    actions: {
        payment: string;
    };
}

export default function BillingShowPage({ title, records = [], actions }: Props) {
    const billing = records[0];

    if (!billing) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <ReceiptText className="size-12 text-muted-foreground/50 mb-4" />
                <h1 className="text-2xl font-semibold">Bill not found</h1>
                <p className="text-muted-foreground">The requested billing record could not be located.</p>
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
                            <h1 className="text-3xl font-semibold tracking-tight">Billing Details</h1>
                            <Badge variant="outline" className="font-mono text-xs">
                                Bill #{billing.id}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">Detailed financial overview and payment management for this patient.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                Patient
                            </CardTitle>
                            <CardDescription>Billing associated with</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium">{billing.patient}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="size-4 text-primary" />
                                Financials
                            </CardTitle>
                            <CardDescription>Amounts for this billing cycle</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Total Amount</span>
                                <span className="font-semibold">${billing.total}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Paid Amount</span>
                                <span className="font-medium text-green-600">${billing.paid}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                                <span className="font-medium">Remaining Balance</span>
                                <span className="font-bold text-red-600">${billing.remaining}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="size-4 text-primary" />
                                Record Status
                            </CardTitle>
                            <CardDescription>Current payment state</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1 h-4 capitalize ${
                                        billing.status === 'paid'
                                            ? 'text-green-600 border-green-200 bg-green-50'
                                            : 'text-red-600 border-red-200 bg-red-50'
                                    }`}
                                >
                                    {billing.status || 'Pending'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        asChild
                        className="flex items-center gap-2"
                    >
                        <Link href={actions.payment}>
                            <CreditCard className="size-4" />
                            Record Payment
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
