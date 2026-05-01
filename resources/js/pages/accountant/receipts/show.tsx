import { Head } from '@inertiajs/react';

import { PageHeader, ReceiptPrint } from '@/components/hospital';

type ReceiptRecord = {
    receipt?: string | null;
    patient?: string | null;
    amount?: string | number | null;
    method?: string | null;
    remaining?: string | number | null;
    accountant?: string | null;
};

export default function ReceiptShow({
    title,
    records = [],
}: {
    title: string;
    records?: ReceiptRecord[];
}) {
    const receipt = records[0] ?? {};

    return (
        <>
            <Head title={title} />

            <div className="space-y-6">
                <PageHeader
                    title={title}
                    description="Print a clean receipt for the recorded payment."
                />
                <ReceiptPrint {...receipt} />
            </div>
        </>
    );
}
