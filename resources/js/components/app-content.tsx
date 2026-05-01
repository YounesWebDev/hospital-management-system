import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset
                className="bg-muted/30"
                {...props}
            >
                <div className="min-h-screen bg-muted/30">
                    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 md:px-6 md:py-5">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        );
    }

    return (
        <main
            className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6"
            {...props}
        >
            {children}
        </main>
    );
}
