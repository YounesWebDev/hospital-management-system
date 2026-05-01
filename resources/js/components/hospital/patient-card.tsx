import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PatientCardProps = {
    name?: string | null;
    code?: string | null;
    email?: string | null;
};

// Compact patient summary for profile and search screens.
export function PatientCard({ name, code, email }: PatientCardProps) {
    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle className="text-base">{name ?? 'Patient'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>Code: {code ?? '-'}</p>
                <p>Email: {email ?? '-'}</p>
            </CardContent>
        </Card>
    );
}
