import { StatusBadge } from '@/components/hospital/status-badge';

type AnalysisStatusBadgeProps = {
    status?: string | null;
};

// Dedicated wrapper so analysis screens can use a clear domain component.
export function AnalysisStatusBadge({ status }: AnalysisStatusBadgeProps) {
    return <StatusBadge status={status ?? 'pending'} />;
}
