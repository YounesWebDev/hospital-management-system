import { Badge } from '@/components/ui/badge';

type RoleBadgeProps = {
    role?: string | null;
};

// Makes user roles easy to scan in staff and account tables.
export function RoleBadge({ role }: RoleBadgeProps) {
    return <Badge variant="outline">{role ?? 'unknown'}</Badge>;
}
