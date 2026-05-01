import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary/95 text-sidebar-primary-foreground shadow-sm ring-1 ring-white/12">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold tracking-tight">
                    HospitalCare
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                    Clinical workspace
                </span>
            </div>
        </>
    );
}
