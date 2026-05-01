import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type PaymentRow = {
    id?: number;
    receipt_number?: string | null;
    amount_paid?: string | number | null;
    payment_method?: string | null;
    created_at?: string | null;
};

type PaymentTableProps = {
    payments: PaymentRow[];
};

// Reusable payment table for accountants and patients.
export function PaymentTable({ payments }: PaymentTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.map((payment, index) => (
                    <TableRow key={payment.id ?? index}>
                        <TableCell>{payment.receipt_number ?? '-'}</TableCell>
                        <TableCell>{payment.amount_paid ?? 0}</TableCell>
                        <TableCell>{payment.payment_method ?? '-'}</TableCell>
                        <TableCell>{payment.created_at ?? '-'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
