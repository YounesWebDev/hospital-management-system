import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { create, index, show } from '@/routes/doctor/analysis-requests';
import { Search, FileText, Plus, User, Calendar, ChevronRight, Beaker , Eye} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    analysisRequests: {
        data: AnalysisRequest[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string;
    };
}

export default function AnalysisRequestIndexPage({ analysisRequests, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 2 || search.length === 0) {
                router.get(
                    index.url({ mergeQuery: { search } }),
                    {},
                    {
                        preserveState: true,
                        replace: true,
                        only: ['analysisRequests', 'filters']
                    }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <>
            <Head title="Analysis Requests" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Analysis Requests</h1>
                        <p className="text-muted-foreground">Manage and review patient analysis requests.</p>
                    </div>
                    <Button asChild className="w-fit">
                        <Link href={create.url()}>
                            <Plus className="mr-2 size-4" /> Create New
                        </Link>
                    </Button>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {analysisRequests.data.length > 0 ? (
                        analysisRequests.data.map((request) => (
                            <Card key={request.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {request.patient.patient_code}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 size-3 text-primary" />
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {request.patient.user.name}
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
                                                {request.analysis_type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`capitalize ${
                                                    request.status === 'completed'
                                                        ? 'bg-green-500'
                                                        : request.status === 'pending'
                                                        ? 'bg-orange-500'
                                                        : request.status === 'in_progress'
                                                        ? 'bg-blue-500'
                                                        : 'bg-gray-400'
                                                }`}
                                            >
                                                {request.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border/50 pt-2">
                                        <span className="text-xs text-muted-foreground">
                                            Request #{request.id}
                                        </span>
                                        <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs group-hover:text-primary">
                                            <Link href={show.url(request.id)} className="flex items-center gap-1">
                                                <Eye/>
                                                View
                                                <ChevronRight className="size-3" />
                                            </Link>
                                        </Button>
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

                {analysisRequests.links.length > 3 && (
                    <div className="flex justify-center gap-2 py-4">
                        {analysisRequests.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                                className="text-xs"
                            >
                                {link.url ? <Link href={link.url}>{link.label}</Link> : link.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
