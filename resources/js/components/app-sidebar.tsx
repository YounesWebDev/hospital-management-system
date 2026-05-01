import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    CalendarDays,
    ClipboardList,
    FlaskConical,
    LayoutGrid,
    ReceiptText,
    Settings,
    Stethoscope,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = String(auth.user?.role ?? '');
    const mainNavItems = navigationFor(role);
    const roleLabel = role.replace('_', ' ');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/60">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-14 rounded-lg">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
                    <div className="rounded-md border border-sidebar-border bg-sidebar-accent/60 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-sidebar-foreground/60">
                            Signed in as
                        </p>
                        <p className="mt-1 text-sm font-semibold capitalize text-sidebar-foreground">
                            {roleLabel || 'team member'}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-sidebar-foreground/75">
                            Quick access to the daily tools for this workspace.
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

/**
 * Role-based navigation for the hospital workspaces.
 */
function navigationFor(role: string): NavItem[] {
    const dashboards: Record<string, string> = {
        admin: '/admin/dashboard',
        receptionist: '/receptionist/dashboard',
        doctor: '/doctor/dashboard',
        lab_technician: '/lab/dashboard',
        accountant: '/accountant/dashboard',
        patient: '/patient/dashboard',
    };

    const common = [
        {
            title: 'Dashboard',
            href: dashboards[role] ?? dashboard(),
            icon: LayoutGrid,
        },
    ];

    const items: Record<string, NavItem[]> = {
        admin: [
            ...common,
            { title: 'Staff', href: '/admin/staff', icon: Users },
            { title: 'Patients', href: '/admin/patients', icon: ClipboardList },
            { title: 'Reports', href: '/admin/reports', icon: Activity },
            { title: 'Settings', href: '/admin/settings', icon: Settings },
        ],
        receptionist: [
            ...common,
            { title: 'Patients', href: '/receptionist/patients', icon: Users },
            {
                title: 'Appointments',
                href: '/receptionist/appointments',
                icon: CalendarDays,
            },
        ],
        doctor: [
            ...common,
            {
                title: 'Patients',
                href: '/doctor/patients/search',
                icon: Stethoscope,
            },
            {
                title: 'Prescriptions',
                href: '/doctor/prescriptions/create',
                icon: ClipboardList,
            },
            {
                title: 'Analyses',
                href: '/doctor/analysis-requests/create',
                icon: FlaskConical,
            },
            {
                title: 'Billing',
                href: '/doctor/billing/create',
                icon: ReceiptText,
            },
        ],
        lab_technician: [
            ...common,
            {
                title: 'Analysis Requests',
                href: '/lab/analysis-requests',
                icon: FlaskConical,
            },
        ],
        accountant: [
            ...common,
            {
                title: 'Patient Billing',
                href: '/accountant/patients/search',
                icon: ReceiptText,
            },
        ],
        patient: [
            ...common,
            { title: 'Profile', href: '/patient/profile', icon: Users },
            {
                title: 'Appointments',
                href: '/patient/appointments',
                icon: CalendarDays,
            },
            {
                title: 'Prescriptions',
                href: '/patient/prescriptions',
                icon: ClipboardList,
            },
            {
                title: 'Analyses',
                href: '/patient/analyses',
                icon: FlaskConical,
            },
            { title: 'Billing', href: '/patient/billing', icon: ReceiptText },
            { title: 'Payments', href: '/patient/payments', icon: ReceiptText },
        ],
    };

    return items[role] ?? common;
}
