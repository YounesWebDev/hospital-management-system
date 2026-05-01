import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatCardProps = {
    title: string;
    value: string | number;
    note?: string;
};

// Small dashboard metric card used by role dashboards.
export function StatCard({ title, value, note }: StatCardProps) {
    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
                {note && <p className="text-sm text-muted-foreground">{note}</p>}
            </CardContent>
        </Card>
    );
}
