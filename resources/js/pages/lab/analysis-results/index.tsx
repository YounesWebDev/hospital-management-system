import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, FlaskConical, Clock, User, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import analysisResults from "@/routes/lab/analysis-results"

interface AnalysisResult {
    id: number;
    patient: string;
    doctor: string;
    type: string;
    result: string;
    created_at: string;
}

interface Props {
    records?: AnalysisResult[];
}

export default function AnalysisResultIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.patient?.toLowerCase().includes(term) ||
            r.doctor?.toLowerCase().includes(term) ||
            r.type?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="Analysis Results" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Analysis Results</h1>
                        <p className="text-muted-foreground">Review and manage all completed laboratory analysis results.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient, doctor or type..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((result) => (
                            <Card key={result.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            Completed
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="mr-1 size-3" />
                                            {result.created_at ? new Date(result.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FlaskConical className="size-4 text-primary" />
                                        {result.type || 'Analysis Result'}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <User className="size-3" />
                                        {result.patient || 'Unknown Patient'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Doctor: </span>
                                            <span className="text-muted-foreground">
                                                {result.doctor || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-border/50">
                                            <p className="text-xs font-medium text-foreground">Summary:</p>
                                            <p className="text-xs text-muted-foreground italic truncate max-w-full">
                                                {result.result || 'No text result provided.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-3 flex justify-end border-t border-border/50">
                                        <Button asChild variant="outline" size="sm" className="h-7 px-2 text-[11px]">
                                            <Link href={analysisResults.show({ analysisResult: result.id }).url}>
                                                <FileText className="mr-1 size-3" /> View Result
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <FlaskConical className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No results found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
