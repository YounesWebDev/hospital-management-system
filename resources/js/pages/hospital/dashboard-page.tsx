import { Head } from '@inertiajs/react';
import { Activity, ClipboardList, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardPageProps = {
    title: string;
    stats?: Record<string, string | number>;
};

export default function DashboardPage({
    title,
    stats = {},
}: DashboardPageProps) {
    const entries = Object.entries(stats);
    const totalStats = entries.length;

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <section className="overflow-hidden rounded-lg border border-border/70 bg-gradient-to-br from-primary/16 via-primary/6 to-accent/14 p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                                <TrendingUp className="size-3.5 text-primary" />
                                Live dashboard
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                                    {title}
                                </h1>
                                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                                    A compact summary of the counts that matter most for this role.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {entries.map(([label, value]) => (
                        <Card key={label} className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-sm text-muted-foreground">
                                            {label}
                                        </CardTitle>
                                        <CardDescription className="mt-1 text-xs">
                                            Current value for this workspace metric.
                                        </CardDescription>
                                    </div>
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Activity className="size-4" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold tracking-tight text-foreground">
                                    {value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ClipboardList className="size-4 text-primary" />
                            <CardTitle className="text-base">Reading the dashboard</CardTitle>
                        </div>
                        <CardDescription>
                            These values are aggregated on the server so each role sees a small, focused operational summary.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </>
    );
}
