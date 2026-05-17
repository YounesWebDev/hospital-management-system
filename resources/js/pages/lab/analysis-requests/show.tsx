import { Head, useForm } from '@inertiajs/react';
import { FlaskConical, User, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface AnalysisRequest {
    id: number;
    patient: string;
    doctor: string;
    analysis_type: string;
    description: string;
    status: string;
}

interface Props {
    title: string;
    records: AnalysisRequest[];
    actions: {
        result: string;
        progress: string;
    };
}

export default function AnalysisRequestShowPage({ title, records = [], actions }: Props) {
    const request = records[0];

    if (!request) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <FlaskConical className="size-12 text-muted-foreground/50 mb-4" />
                <h1 className="text-2xl font-semibold">Request not found</h1>
                <p className="text-muted-foreground">The requested analysis record could not be located.</p>
            </div>
        );
    }

    const { post, processing } = useForm();

    const markInProgress = (e: React.FormEvent) => {
        e.preventDefault();
        post(actions.progress);
    };

    return (
        <>
            <Head title={title} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold tracking-tight">{request.analysis_type}</h1>
                            <Badge variant="outline" className="font-mono text-xs">
                                Request #{request.id}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">Detailed laboratory analysis request and processing status.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                Patient Information
                            </CardTitle>
                            <CardDescription>Patient associated with this request</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Patient Name</span>
                                <span className="font-medium">{request.patient}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                Requesting Doctor
                            </CardTitle>
                            <CardDescription>Medical professional who ordered the test</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Doctor Name</span>
                                <span className="font-medium">{request.doctor}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="size-4 text-primary" />
                                Status & Timing
                            </CardTitle>
                            <CardDescription>Current state of the request</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Current Status</span>
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1 h-4 capitalize ${
                                        request.status === 'completed'
                                            ? 'text-green-600 border-green-200 bg-green-50'
                                            : request.status === 'in_progress'
                                            ? 'text-blue-600 border-blue-200 bg-blue-50'
                                            : 'text-muted-foreground border-border bg-muted/50'
                                    }`}
                                >
                                    {request.status || 'Pending'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FlaskConical className="size- la text-primary" />
                            Analysis Details
                        </CardTitle>
                        <CardDescription>Specific instructions and requirements for the laboratory</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-muted-foreground">Request Description</span>
                                <p className="text-base text-foreground leading-relaxed">
                                    {request.description || 'No specific description provided for this request.'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    {request.status === 'requested' && (
                        <form onSubmit={markInProgress}>
                            <Button type="submit" disabled={processing} className="flex items-center gap-2">
                                <Clock className="size-4" />
                                {processing ? 'Updating...' : 'Mark as In Progress'}
                            </Button>
                        </form>
                    )}
                    <Button
                        asChild
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Link href={actions.result}>
                            <CheckCircle className="size-4" />
                            Record Results
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
