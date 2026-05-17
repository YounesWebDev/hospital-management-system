import { Head } from '@inertiajs/react';
import { Users, Calendar, DollarSign, Beaker, FileText, Stethoscope, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    stats?: Record<string, string | number>;
}

export default function ReportsPage({ stats = {} }: Props) {
    const statItems = [
        { label: 'Total Patients', value: stats['Patients'] ?? 0, icon: Users, color: 'text-blue-500' },
        { label: 'Hospital Staff', value: stats['Staff'] ?? 0, icon: UserCheck, color: 'text-indigo-500' },
        { label: 'Specialist Doctors', value: stats['Doctors'] ?? 0, icon: Stethoscope, color: 'text-emerald-500' },
        { label: 'Lab Requests', value: stats['Lab requests'] ?? 0, icon: Beaker, color: 'text-red-500' },
        { label: 'Prescriptions', value: stats['Prescriptions'] ?? 0, icon: FileText, color: 'text-orange-500' },
        { label: 'Appointments', value: stats['Appointments'] ?? 0, icon: Calendar, color: 'text-purple-500' },
        { label: 'Total Revenue', value: `$${stats['Revenue'] ?? 0}`, icon: DollarSign, color: 'text-yellow-600' },
        { label: 'Paid Bills', value: stats['Paid bills'] ?? 0, icon: DollarSign, color: 'text-green-600' },
        { label: 'Unpaid Bills', value: stats['Unpaid bills'] ?? 0, icon: DollarSign, color: 'text-red-600' },
    ];

    return (
        <>
            <Head title="Hospital Statistics" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">Hospital Statistics</h1>
                        <p className="text-muted-foreground">Real-time overview of hospital operations and financial health.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {statItems.map((item) => (
                        <Card key={item.label} className="group hover:border-primary/50 transition-colors">
                            <CardHeader className="p-4 space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                                        <item.icon className="size-5" />
                                    </div>
                                </div>
                                <CardTitle className="text-lg">{item.label}</CardTitle>
                                <CardDescription>
                                    Current total count across system
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-3xl font-bold tracking-tight">
                                    {item.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
