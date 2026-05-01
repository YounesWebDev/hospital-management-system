import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PrescriptionCardProps = {
    diagnosis?: string | null;
    medicine?: string | null;
    instructions?: string | null;
    doctor?: string | null;
    createdAt?: string | null;
    items?: Array<{
        name?: string | null;
        dosage?: string | null;
        duration?: string | null;
    }>;
};

// Simple prescription display card for doctor and patient views.
export function PrescriptionCard({
    diagnosis,
    medicine,
    instructions,
    doctor,
    createdAt,
    items = [],
}: PrescriptionCardProps) {
    return (
        <Card className="rounded-lg">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base">{medicine ?? 'Prescription'}</CardTitle>
                    <p className="text-xs text-muted-foreground">{createdAt ?? ''}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Prescribed by {doctor ?? 'Unknown doctor'}
                </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Diagnosis: {diagnosis ?? '-'}</p>
                <p>Instructions: {instructions ?? '-'}</p>
                {items.length > 0 ? (
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div key={index} className="rounded-md border border-border/60 bg-background/80 px-3 py-2">
                                <span className="font-medium text-foreground">{item.name ?? 'Medicine'}</span>
                                <span className="text-muted-foreground">
                                    {' '} - {item.dosage ?? 'No dosage'} - {item.duration ?? 'No duration'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
