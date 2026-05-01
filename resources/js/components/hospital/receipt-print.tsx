import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ReceiptPrintProps = {
    receipt?: string | null;
    patient?: string | null;
    amount?: string | number | null;
    method?: string | null;
    remaining?: string | number | null;
    accountant?: string | null;
};

// Printable receipt view with a browser print button.
export function ReceiptPrint({
    receipt,
    patient,
    amount,
    method,
    remaining,
    accountant,
}: ReceiptPrintProps) {
    return (
        <Card className="rounded-lg print:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Receipt {receipt ?? ''}</CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="print:hidden"
                >
                    <Printer className="mr-2 size-4" />
                    Print
                </Button>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
                <p>Patient: {patient ?? '-'}</p>
                <p>Amount paid: {amount ?? 0}</p>
                <p>Payment method: {method ?? '-'}</p>
                <p>Remaining: {remaining ?? 0}</p>
                <p>Accountant: {accountant ?? '-'}</p>
            </CardContent>
        </Card>
    );
}
