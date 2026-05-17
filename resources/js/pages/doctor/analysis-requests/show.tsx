import { Head, Link } from '@inertiajs/react';

import {
    User,
    Calendar,
    FileText,
    Beaker,
    ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { index } from '@/routes/doctor/analysis-requests';

interface AnalysisRequest {
    id: number;

    patient: {
        patient_code: string;

        user: {
            name: string;
        };
    };

    analysis_type: string;
    description: string;
    status: string;
    created_at: string;
}

interface Props {
    analysisRequest: AnalysisRequest;
}

export default function AnalysisRequestShowPage({
    analysisRequest,
}: Props) {
    return (
        <>
            <Head
                title={`Analysis Request #${analysisRequest.id}`}
            />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                    >
                        <Link
                            href={index.url()}
                            className="flex items-center hover:text-primary gap-1"
                        >
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>

                    <Badge
                        variant="outline"
                        className="font-mono"
                    >
                        ID: #{analysisRequest.id}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <div className="space-y-6">
                        <Card className="border border-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Beaker className="size-5 text-primary" />
                                    </div>

                                    <div>
                                        <CardTitle className="text-xl">
                                            Analysis Request Details
                                        </CardTitle>

                                        <CardDescription>
                                            Details of the laboratory
                                            analysis requested for {analysisRequest.patient.user.name}.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Patient
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <User className="size-4 text-primary" />

                                            {
                                                analysisRequest
                                                    .patient.user
                                                    .name
                                            }{' '}
                                            (
                                            {
                                                analysisRequest
                                                    .patient
                                                    .patient_code
                                            }
                                            )
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date Requested
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar className="size-4 text-primary" />

                                            {new Date(
                                                analysisRequest.created_at,
                                            ).toLocaleDateString(
                                                'en-US',
                                                {
                                                    weekday:
                                                        'long',
                                                    year:
                                                        'numeric',
                                                    month:
                                                        'long',
                                                    day: 'numeric',
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-primary" />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Beaker className="size-4 text-primary" />
                                        Analysis Type
                                    </div>

                                    <div className="flex flex-col gap-1 rounded-xl border border-primary bg-card/50 p-4 transition-colors hover:bg-card/80">
                                        <span className="text-lg font-semibold">
                                            {
                                                analysisRequest.analysis_type
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <FileText className="size-4 text-primary" />
                                        Clinical Description /
                                        Instructions
                                    </div>

                                    <div className="flex flex-col gap-1 rounded-xl border border-primary bg-card/50 p-4 transition-colors hover:bg-card/80">
                                        <p className="text-base leading-relaxed">
                                            {analysisRequest.description ||
                                                'No specific description provided'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border border-primary bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Quick Summary
                                </CardTitle>

                                <CardDescription>
                                    Status and summary of this
                                    request
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Patient:
                                        </span>

                                        <span className="font-medium">
                                            {
                                                analysisRequest
                                                    .patient.user
                                                    .name
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Type:
                                        </span>

                                        <span className="font-medium">
                                            {
                                                analysisRequest.analysis_type
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Status:
                                        </span>

                                        <Badge className={`h-5 px-2 text-[10px] capitalize text-white ${
                                            analysisRequest.status === 'completed'
                                            ? 'bg-green-500'
                                            : analysisRequest.status === 'pending'
                                            ? 'bg-orange-500'
                                            : analysisRequest.status === 'in_progress'
                                            ? 'bg-blue-500'
                                            : 'bg-gray-400'
                                        }`}
                                        >
                                            {
                                                analysisRequest.status
                                            }
                                        </Badge>
                                    </div>
                                </div>

                                <Separator className="bg-primary" />

                                <div className="pt-2">
                                    <p className="text-xs italic text-muted-foreground">
                                        This analysis request has
                                        been transmitted to the
                                        laboratory department for
                                        processing.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
