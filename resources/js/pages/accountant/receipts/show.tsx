import { Head } from '@inertiajs/react';
import { ReceiptText, User, CreditCard, Clock, Printer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReceiptPrint } from '@/components/hospital';

type ReceiptRecord = {
    receipt?: string | null;
    patient?: string | null;
    amount?: string | number | null;
    method?: string | null;
    remaining?: string | number | null;
    accountant?: string | null;
};

export default function ReceiptShow({
    title,
    records = [],
}: {
    title: string;
    records?: ReceiptRecord[];
}) {
    const receipt = records[0] ?? {};

    return (
        <>
            <Head title={title} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold tracking-tight">Payment Receipt</h1>
                            <Badge variant="outline" className="font-mono text-xs">
                                {receipt.receipt || 'N/A'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">Official record of the processed payment. This page is optimized for printing.</p>
                    </div>
                    <Button
                        onClick={() => window.print()}
                        className="flex items-center gap-2"
                    >
                        <Printer className="size-4" /> Print Receipt
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                Patient
                            </CardTitle>
                            <CardDescription>Recipient of the payment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium">{receipt.patient || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="size-4 text-primary" />
                                Transaction
                            </CardTitle>
                            <CardDescription>Payment details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Amount Paid</span>
                                <span className="font-bold">${receipt.amount || '0.00'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Method</span>
                                <span className="font-medium capitalize">{receipt.method || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="size-4 text-primary" />
                                Balance
                            </CardTitle>
                            <CardDescription>Remaining amount after payment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Remaining</span>
                                <span className="font-bold text-red-600">${receipt.remaining || '0.00'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center py-8">
                    <div className="max-w-2xl w-full bg-background p-8 rounded-xl border border-dashed border-border shadow-inner">
                        <ReceiptPrint {...receipt} />
                    </div>
                </div>
            </div>
        </>
    );
}

function Badge({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${className}`}>{children}</span>;
}
