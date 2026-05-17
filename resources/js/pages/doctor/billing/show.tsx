import { Head, Link } from '@inertiajs/react';

import {
    User,
    Calendar,
    FileText,
    Receipt,
    ArrowLeft,
    ClipboardList,
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

import { index } from '@/routes/doctor/billing';

interface BillingItem {
    id: number;
    item_type: string;
    description: string;
    amount: string;
}

interface BillingRecord {
    id: number;

    patient: {
        patient_code: string;

        user: {
            name: string;
        };
    };

    total_amount: string;
    paid_amount: string;
    remaining_amount: string;
    status: string;
    created_at: string;

    items: BillingItem[];
}

interface Props {
    billing: BillingRecord;
}

export default function BillingShowPage({
    billing,
}: Props) {
    return (
        <>
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
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <div className="space-y-6">
                        <Card className="border border-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <FileText className="size-5 text-primary" />
                                    </div>

                                    <div>
                                        <CardTitle className="text-xl">
                                            Billing Details
                                        </CardTitle>

                                        <CardDescription>
                                            Financial record and
                                            itemized charges for {billing.patient.user.name}
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
                                                billing.patient.user
                                                    .name
                                            }
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Date
                                        </label>

                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar className="size-4 text-primary" />

                                            {new Date(
                                                billing.created_at,
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
                                        <ClipboardList className="size-4 text-primary" />
                                        Billing Status
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge
                                            
                                            className={`capitalize ${
                                                billing.status === 'paid'
                                                    ? 'bg-green-500'
                                                    : billing.status === 'partially_paid'
                                                    ? 'bg-orange-500'
                                                    : 'bg-red-500'
                                            }`}
                                        >
                                            {
                                                billing.status === 'paid'
                                                    ? 'Paid'
                                                    : billing.status === 'partially_paid'
                                                    ? 'Partially Paid'
                                                    : 'Unpaid'
                                            }
                                        </Badge>

                                        <span className="text-sm text-muted-foreground">
                                            Patient has{' '}
                                            {
                                                billing.remaining_amount
                                            }{' '}
                                            remaining to pay.
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-primary">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Receipt className="size-5 text-primary" />
                                    </div>

                                    <CardTitle className="text-lg">
                                        Itemized Charges
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid gap-4">
                                    {billing.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-3 rounded-xl border border-primary bg-card/50 p-4 transition-colors hover:bg-card/80"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-lg font-semibold">
                                                    <Receipt className="size-4 text-primary" />

                                                    {
                                                        item.description
                                                    }
                                                </span>

                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        className={`text-[10px] capitalize ${
                                                            billing.status === 'paid'
                                                                ? 'bg-green-500 text-white'
                                                                : billing.status === 'unpaid'
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-orange-500 text-white'
                                                        }`}
                                                    >
                                                        {billing.status === 'paid' ? 'Paid' : (billing.status === 'unpaid' ? 'Unpaid' : 'Pending')}
                                                    </Badge>
                                                    <span className="font-mono font-semibold text-primary">
                                                        {item.amount}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                                                <div className="space-y-1">
                                                    <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        Type
                                                    </span>

                                                    <span className="font-medium capitalize">
                                                        {item.item_type.replace(
                                                            '_',
                                                            ' ',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {billing.items.length ===
                                        0 && (
                                        <div className="py-8 text-center italic text-muted-foreground">
                                            No charges listed in
                                            this billing record.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary bg-forground">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Financial Summary
                                </CardTitle>

                                <CardDescription>
                                    Summary of this billing
                                    record
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
                                                billing.patient.user
                                                    .name
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Items:
                                        </span>

                                        <span className="font-medium">
                                            {
                                                billing.items
                                                    .length
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Total:
                                        </span>

                                        <span className="font-medium text-foreground">
                                            {
                                                billing.total_amount
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Paid:
                                        </span>

                                        <span className="font-medium text-foreground">
                                            {
                                                billing.paid_amount
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Remaining:
                                        </span>

                                        <span className="font-medium text-destructive">
                                            {
                                                billing.remaining_amount
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Status:
                                        </span>

                                        <Badge
                                            
                                            className={`capitalize ${
                                                billing.status === 'paid'
                                                    ? 'bg-green-500'
                                                    : billing.status === 'partially_paid'
                                                    ? 'bg-orange-500'
                                                    : 'bg-red-500'
                                            }`}
                                        >
                                            {
                                                billing.status === 'paid'
                                                    ? 'Paid'
                                                    : billing.status === 'partially_paid'
                                                    ? 'Partially Paid'
                                                    : 'Unpaid'
                                            }
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}