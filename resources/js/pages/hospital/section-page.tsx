import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

function formatCellValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (Array.isArray(value)) {
        return value.join(', ');
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

type SectionPageProps = {
    title: string;
    records?: Array<Record<string, unknown>>;
    actions?: Record<string, string>;
};

export default function SectionPage({
    title,
    records = [],
    actions = {},
}: SectionPageProps) {
    const columns = records[0] ? Object.keys(records[0]) : [];
    const actionEntries = Object.entries(actions);

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <section className="overflow-hidden rounded-lg border border-border/70 bg-linear-to-br from-primary/14 via-primary/5 to-accent/14 p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                                <FolderOpen className="size-3.5 text-primary" />
                                Hospital records
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                                    {title}
                                </h1>
                                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                                    Review key records, open actions quickly, and keep the workflow readable for the team.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Records
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-foreground">
                                    {records.length}
                                </p>
                            </div>
                            <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Columns
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-foreground">
                                    {columns.length}
                                </p>
                            </div>
                            <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Actions
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-foreground">
                                    {actionEntries.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {actionEntries.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {actionEntries.map(([label, href], index) => (
                            <Button key={label} asChild variant={index === 0 ? 'default' : 'outline'} className="rounded-lg">
                                <Link href={href} className="gap-2">
                                    {label}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        ))}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                    <Card className="overflow-hidden rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader className="border-b border-border/70 bg-muted/35">
                            <CardTitle className="text-base">Records overview</CardTitle>
                            <CardDescription>
                                Each row is shaped by the controller so the page stays predictable and easy to scan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {records.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <FolderOpen className="size-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">No records yet</p>
                                        <p className="text-sm text-muted-foreground">
                                            Once data is created, it will appear here in the shared records table.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Table className="min-w-[700px]">
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="border-border/70 hover:bg-transparent">
                                            {columns.map((column) => (
                                                <TableHead
                                                    key={column}
                                                    className="capitalize"
                                                >
                                                    {column.replaceAll('_', ' ')}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {records.map((record, index) => (
                                            <TableRow
                                                key={index}
                                                className="border-border/60"
                                            >
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column}
                                                        className="align-top text-foreground"
                                                    >
                                                        {formatCellValue(record[column])}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Page summary</CardTitle>
                                <CardDescription>
                                    Quick context for what this screen is showing right now.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="rounded-lg border border-border/70 bg-muted/35 p-4">
                                    <p className="font-medium text-foreground">Current dataset</p>
                                    <p className="mt-1">{records.length} records prepared for this screen.</p>
                                </div>
                                <div className="rounded-lg border border-border/70 bg-muted/35 p-4">
                                    <p className="font-medium text-foreground">Visible fields</p>
                                    <p className="mt-1">{columns.length} columns are available in the current table view.</p>
                                </div>
                                <div className="rounded-lg border border-border/70 bg-muted/35 p-4">
                                    <p className="font-medium text-foreground">Workflow actions</p>
                                    <p className="mt-1">
                                        {actionEntries.length > 0
                                            ? 'This page includes direct navigation actions for the next workflow step.'
                                            : 'This page is currently read-only and does not expose extra actions.'}
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
