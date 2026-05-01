import { Badge } from '@/components/ui/badge';

type StatusBadgeProps = {
    status?: string | null;
};

// Shows simple status text with a consistent badge color.
export function StatusBadge({ status }: StatusBadgeProps) {
    const normalizedStatus = (status ?? 'unknown').toLowerCase();
    const variant =
        normalizedStatus === 'paid' || normalizedStatus === 'completed'
            ? 'default'
            : normalizedStatus === 'cancelled' || normalizedStatus === 'overdue'
              ? 'destructive'
              : 'secondary';

    return <Badge variant={variant}>{normalizedStatus}</Badge>;
}
