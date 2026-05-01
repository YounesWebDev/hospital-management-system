import '@inertiajs/core';
import type { Auth } from '@/types/auth';
import type { HeaderNotification } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            notifications: {
                unreadCount: number;
                items: HeaderNotification[];
            };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
