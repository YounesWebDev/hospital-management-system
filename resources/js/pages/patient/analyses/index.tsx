import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, FlaskConical, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Analysis {
    id: number;
    doctor: string;
    type: string;
    status: string;
    created_at: string;
    result: string;
}

interface Props {
    records?: Analysis[];
}

export default function AnalysisIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.doctor?.toLowerCase().includes(term) ||
            r.type?.toLowerCase().includes(term) ||
            r.status?.toLowerCase().includes(term)
        );
    }, [search, records]);

    return (
        <>
            <Head title="My Analyses" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">My Analyses</h1>
                        <p className="text-muted-foreground">Review your laboratory analysis requests and results.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by doctor, type or status..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((analysis) => (
                            <Card key={analysis.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            Analysis
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="mr-1 size-3" />
                                            {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FlaskConical className="size-4 text-primary" />
                                        {analysis.type || 'Laboratory Test'}
                                    </CardTitle>
                                    <CardDescription>
                                        Requested by: {analysis.doctor || 'TBD'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Doctor: </span>
                                            <span className="text-muted-foreground">
                                                {analysis.doctor || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] px-1 h-4">
                                                {analysis.status || 'N/A'}
                                            </Badge>
                                        </div>
                                        {analysis.result && (
                                            <div className="pt-2 border-t border-border/50">
                                                <p className="text-xs font-medium text-foreground">Result:</p>
                                                <p className="text-xs text-muted-foreground italic">
                                                    {analysis.result}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <FlaskConical className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No analyses found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
