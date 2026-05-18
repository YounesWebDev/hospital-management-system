import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import billing from '@/routes/accountant/billing';

import {
    Search,
    User,
    Mail,
    Fingerprint,
    Eye,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Patient {
    id: number;
    code: string;
    name: string;
    email: string;
    latest_bill_id?: number | null;
    latest_bill_status?: string | null;
}

interface Props {
    records?: Patient[];
}

export default function PatientBillingSearchPage({
    records = [],
}: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();

        if (term.length < 2) {
            return records;
        }

        return records.filter((patient) => {
            return (
                patient.name?.toLowerCase().includes(term) ||
                patient.email?.toLowerCase().includes(term) ||
                patient.code?.toLowerCase().includes(term)
            );
        });
    }, [search, records]);

    return (
        <>
            <Head title="Find Patient Billing" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Find Patient Billing
                        </h1>

                        <p className="text-muted-foreground">
                            Search for patients to manage their billing and
                            record payments.
                        </p>
                    </div>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />

                    <Input
                        placeholder="Search by name, email or code..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((patient) => (
                            <Card
                                key={patient.id}
                                className="group transition-colors hover:border-primary/50"
                            >
                                <CardHeader className="space-y-2 p-4">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-[10px]"
                                        >
                                            {patient.code}
                                        </Badge>

                                        {patient.latest_bill_status && (
                                            <Badge
                                                variant="outline"
                                                className={`h-5 px-2 text-[10px] capitalize ${
                                                    patient.latest_bill_status ===
                                                    'paid'
                                                        ? 'border-green-200 bg-green-50 text-green-600'
                                                        : patient.latest_bill_status ===
                                                            'partial'
                                                          ? 'border-orange-200 bg-orange-50 text-orange-600'
                                                          : 'border-red-200 bg-red-50 text-red-600'
                                                }`}
                                            >
                                                {patient.latest_bill_status}
                                            </Badge>
                                        )}
                                    </div>

                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="size-4 text-primary" />
                                        {patient.name}
                                    </CardTitle>

                                    <CardDescription className="flex items-center gap-2">
                                        <Mail className="size-3" />
                                        <span className="truncate">
                                            {patient.email}
                                        </span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-4 pt-0">
                                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Fingerprint className="size-3" />
                                            <span>{patient.code}</span>
                                        </div>

                                        {patient.latest_bill_id ? (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-2 text-[11px]"
                                            >
                                                <Link
                                                    href={
                                                        billing.show({
                                                            billing:
                                                                patient.latest_bill_id,
                                                        }).url
                                                    }
                                                >
                                                    <Eye className="mr-1 size-3" />
                                                    View Bill
                                                </Link>
                                            </Button>
                                        ) : (
                                            <span className="text-xs italic">
                                                No active bills
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full rounded-lg border bg-muted/20 py-12 text-center">
                            <Search className="mx-auto mb-3 size-12 text-muted-foreground/50" />

                            <p className="text-muted-foreground">
                                No patients found matching your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}