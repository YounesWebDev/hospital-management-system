import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Banknote,
    CalendarDays,
    ClipboardList,
    FileText,
    FlaskConical,
    LayoutGrid,
    ReceiptText,
    Stethoscope,
    Users,
    BellRing,
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
import admin from '@/routes/admin';
import receptionist from '@/routes/receptionist';
import doctor from '@/routes/doctor';
import lab from '@/routes/lab';
import accountant from '@/routes/accountant';
import patient from '@/routes/patient';
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
        admin: admin.dashboard.url(),
        receptionist: receptionist.dashboard.url(),
        doctor: doctor.dashboard.url(),
        lab_technician: lab.dashboard.url(),
        accountant: accountant.dashboard.url(),
        patient: patient.dashboard.url(),
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
            { title: 'Staff', href: admin.staff.index.url(), icon: Users },
            { title: 'Patients', href: admin.patients.index.url(), icon: ClipboardList },
            { title: 'Appointments', href: admin.appointments.index.url(), icon: CalendarDays },
            { title: 'Analyses', href: admin.analyses.index.url(), icon: FlaskConical },
            { title: 'Billing', href: admin.billing.index.url(), icon: ReceiptText },
            { title: 'Payments', href: admin.payments.index.url(), icon: Banknote },
            { title: 'Reports', href: admin.reports.index.url(), icon: Activity },
        ],
        receptionist: [
            ...common,
            { title: 'Patients', href: receptionist.patients.index.url(), icon: Users },
            {
                title: 'Appointments',
                href: receptionist.appointments.index.url(),
                icon: CalendarDays,
            },
            {
                title: 'Notifications',
                href: receptionist.notifications.index.url(),
                icon: BellRing,
            },
        ],
        doctor: [
            ...common,
            {
                title: 'Patients',
                href: doctor.patients.search.url(),
                icon: Stethoscope,
            },
            {
                title: 'Appointments',
                href: doctor.appointments.index.url(),
                icon: CalendarDays,
            },
            {
                title: 'Prescriptions',
                href: doctor.prescriptions.index.url(),
                icon: ClipboardList,
            },
            {
                title: 'Analyses',
                href: doctor.analysisRequests.index.url(),
                icon: FlaskConical,
            },
            {
                title: 'Billing',
                href: doctor.billing.index.url(),
                icon: ReceiptText,
            },
        ],
        lab_technician: [
            ...common,
            {
                title: 'Analysis Requests',
                href: lab.analysisRequests.index.url(),
                icon: FlaskConical,
            },
            {
                title: 'Analysis Results',
                href: lab.analysisResults.index.url(),
                icon: FileText,
            },
        ],
        accountant: [
            ...common,
            {
                title: 'Patient Search',
                href: accountant.patients.search.url(),
                icon: Users,
            },
            {
                title: 'Billing Overview',
                href: accountant.billing.index.url(),
                icon: ReceiptText,
            },
            {
                title: 'Payment History',
                href: accountant.payments.index.url(),
                icon: Banknote,
            },
        ],
        patient: [
            ...common,
            { title: 'Profile', href: patient.profile.url(), icon: Users },
            {
                title: 'Appointments',
                href: patient.appointments.index.url(),
                icon: CalendarDays,
            },
            {
                title: 'Prescriptions',
                href: patient.prescriptions.index.url(),
                icon: ClipboardList,
            },
            {
                title: 'Analyses',
                href: patient.analyses.index.url(),
                icon: FlaskConical,
            },
            { title: 'Billing', href: patient.billing.index.url(), icon: ReceiptText },
            { title: 'Payments', href: patient.payments.index.url(), icon: Banknote },
        ],
    };

    return items[role] ?? common;
}
