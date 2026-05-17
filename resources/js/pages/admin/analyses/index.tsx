import { Head, Link } from '@inertiajs/react';
import { Search, FileText, Calendar, ChevronRight, Beaker, Eye, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';

interface AnalysisRequest {
    id: number;
    patient: {
        patient_code: string;
        user: { name: string };
    };
    analysis_type: string;
    status: string;
    created_at: string;
}

interface Props {
    records?: AnalysisRequest[];
}

export default function AnalysisIndexPage({ records = [] }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (term.length < 2) return records;
        return records.filter(r =>
            r.patient?.user?.name?.toLowerCase().includes(term) ||
            r.patient?.patient_code?.toLowerCase().includes(term) ||
            r.analysis_type?.toLowerCase().includes(term) ||
            r.status?.toLowerCase().includes(term)
        );
    }, [search, records]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500 hover:bg-green-600 text-white';
            case 'pending':
                return 'bg-orange-500 hover:bg-orange-600 text-white';
            case 'in_progress':
                return 'bg-blue-500 hover:bg-blue-600 text-white';
            case 'cancelled':
                return 'bg-red-500 hover:bg-red-600 text-white';
            default:
                return 'bg-gray-500 hover:bg-gray-600 text-white';
        }
    };

    return (
        <>
            <Head title="Analyses Report" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Analyses Report</h1>
                        <p className="text-muted-foreground">Overview and status of all laboratory analysis requests.</p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient name or code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((request) => (
                            <Card key={request.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {request.patient?.patient_code || 'N/A'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 size-3 text-primary" />
                                            {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {request.patient?.user?.name || 'Unknown Patient'}
                                    </CardTitle>
                                    <CardDescription>
                                        Analysis Request #{request.id}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4 pt-0">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Beaker className="size-3 text-primary" />
                                            <span className="font-medium text-foreground">Analysis: </span>
                                            <span className="text-muted-foreground">
                                                {request.analysis_type || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`capitalize ${getStatusClass(request.status || 'unknown')}`}
                                            >
                                                {request.status || 'Unknown'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                        <span className="text-xs text-muted-foreground">
                                            Ref ID: {request.id}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
                            <FileText className="mx-auto size-12 text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground">No analysis requests found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
