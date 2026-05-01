import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

type CredentialExportButtonProps = {
    href: string;
};

// Link-style button reserved for credential export downloads.
export function CredentialExportButton({ href }: CredentialExportButtonProps) {
    return (
        <Button asChild variant="outline" size="sm">
            <a href={href}>
                <Download className="mr-2 size-4" />
                Export
            </a>
        </Button>
    );
}
