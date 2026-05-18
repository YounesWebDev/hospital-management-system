import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    FlaskConical,
    User,
    Calendar,
    FileText,
    Download,
    ArrowLeft,
} from 'lucide-react';

import analysisResults from '@/routes/lab/analysis-results';

interface AnalysisResult {
    id: number;
    result_text: string | null;
    file_path: string | null;
    uploaded_at: string;

    analysis_request: {
        id: number;
        analysis_type: string;
        status: string;

        patient: {
            user: {
                name: string;
            };
        };

        doctor: {
            user: {
                name: string;
            };
        };
    };

    lab_technician: {
        user: {
            name: string;
        };
    };
}

interface Props {
    result: AnalysisResult;
}

export default function AnalysisResultShowPage({ result }: Props) {

    return (
        <>
            <Head title={`Analysis Result #${result.id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                        >
                            <Link href={analysisResults.index().url}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>

                        <div className="space-y-1">
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Analysis Result
                            </h1>

                            <p className="text-muted-foreground">
                                Detailed laboratory findings for the patient.
                            </p>
                        </div>
                    </div>

                    <Badge variant="outline" className="px-3 py-1">
                        Completed
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Side */}
                    <div className="space-y-6 md:col-span-1">
                        {/* Patient & Doctor */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <User className="size-4 text-primary" />
                                    Patient & Doctor
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Patient
                                    </p>

                                    <p className="text-sm font-medium">
                                        {result.analysis_request?.patient?.user?.name ||
                                            'N/A'}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Requesting Doctor
                                    </p>

                                    <p className="text-sm font-medium">
                                        {result.analysis_request?.doctor?.user?.name ||
                                            'N/A'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="size-4 text-primary" />
                                    Details
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Analysis Type
                                    </p>

                                    <p className="flex items-center gap-2 text-sm font-medium">
                                        <FlaskConical className="size-3" />

                                        {result.analysis_request?.analysis_type ||
                                            'N/A'}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Uploaded At
                                    </p>

                                    <p className="text-sm font-medium">
                                        {result.uploaded_at
                                            ? new Date(
                                                  result.uploaded_at
                                              ).toLocaleString()
                                            : 'N/A'}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Lab Technician
                                    </p>

                                    <p className="text-sm font-medium">
                                        {result.lab_technician?.user?.name ||
                                            'N/A'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <FileText className="size-5 text-primary" />
                                    Analysis Findings
                                </CardTitle>

                                <CardDescription>
                                    The final results derived from the laboratory
                                    analysis.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="min-h-[200px] whitespace-pre-wrap rounded-lg border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed">
                                    {result.result_text ||
                                        'No detailed text result provided.'}
                                </div>

                                {result.file_path && (
                                    <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-md bg-primary/10 p-2">
                                                <FileText className="size-5 text-primary" />
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    Supporting Document
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    PDF or Image analysis result
                                                </p>
                                            </div>
                                        </div>

                                        <Button asChild size="sm" className="h-8">
                                            <a
                                                href={`/storage/${result.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                <Download className="size-3" />
                                                Download File
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}