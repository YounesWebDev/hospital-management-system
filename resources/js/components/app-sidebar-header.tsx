import { NotificationMenu } from '@/components/notification-menu';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="mb-6 flex min-h-16 shrink-0 items-center gap-3 rounded-md border bg-card px-4 shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-14 md:px-5">
            <SidebarTrigger className="-ml-1 rounded-md" />
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Hospital management
                </p>
                <div className="mt-1 min-w-0">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            <NotificationMenu />
        </header>
    );
}
