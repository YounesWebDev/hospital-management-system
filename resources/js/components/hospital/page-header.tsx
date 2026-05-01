type PageHeaderProps = {
    title: string;
    description?: string;
};

// Shared heading block for hospital workflow pages.
export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
