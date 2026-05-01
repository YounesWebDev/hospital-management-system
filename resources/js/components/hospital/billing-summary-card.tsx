import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BillingSummaryCardProps = {
    total?: string | number | null;
    paid?: string | number | null;
    remaining?: string | number | null;
};

// Shows the important billing totals in one place.
export function BillingSummaryCard({
    total,
    paid,
    remaining,
}: BillingSummaryCardProps) {
    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle className="text-base">Billing Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
                <p>Total: {total ?? 0}</p>
                <p>Paid: {paid ?? 0}</p>
                <p>Remaining: {remaining ?? 0}</p>
            </CardContent>
        </Card>
    );
}
