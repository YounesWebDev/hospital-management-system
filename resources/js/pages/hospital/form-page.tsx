import { Form, Head, usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type FieldOption = {
    label: string;
    value: string;
};

export type FormField = {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'number' | 'date' | 'time' | 'file' | 'textarea' | 'select';
    options?: FieldOption[];
    required?: boolean;
    accept?: string;
    visibleWhen?: {
        field: string;
        equals: string | string[];
    };
};

type FormPageProps = {
    title: string;
    action: string;
    method?: 'post' | 'patch';
    fields: FormField[];
    submission?: 'inertia' | 'native';
    submitLabel?: string;
    helperText?: string;
};

type PagePropsWithErrors = {
    errors?: Record<string, string>;
};

function fieldClass(field: FormField): string {
    if (field.type === 'textarea') {
        return 'grid gap-2 md:col-span-2 xl:col-span-3';
    }

    if (field.type === 'select' || field.type === 'date' || field.type === 'time') {
        return 'grid gap-2';
    }

    return 'grid gap-2';
}

function fieldTypeLabel(field: FormField): string {
    if (field.type === 'select') {
        return 'Choose one';
    }

    if (field.type === 'textarea') {
        return 'Long text';
    }

    if (field.type === 'date') {
        return 'Date field';
    }

    if (field.type === 'number') {
        return 'Numeric value';
    }

    return field.required ? 'Required field' : 'Optional field';
}

function isFieldVisible(field: FormField, fieldValues: Record<string, string>): boolean {
    if (!field.visibleWhen) {
        return true;
    }

    const expectedValues = Array.isArray(field.visibleWhen.equals)
        ? field.visibleWhen.equals
        : [field.visibleWhen.equals];

    return expectedValues.includes(fieldValues[field.visibleWhen.field] ?? '');
}

export default function FormPage({
    title,
    action,
    method = 'post',
    fields,
    submission = 'inertia',
    submitLabel = 'Save',
    helperText = 'Fill the required fields and submit the workflow.',
}: FormPageProps) {
    const page = usePage<PagePropsWithErrors>();
    const nativeErrors = page.props.errors ?? {};
    const [nativeSubmitting, setNativeSubmitting] = useState(false);
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
    const [activeDateField, setActiveDateField] = useState<string | null>(null);
    const csrfToken = useMemo(() => {
        const meta = document.querySelector('meta[name="csrf-token"]');

        return meta?.getAttribute('content') ?? '';
    }, []);

    const usesNativeSubmit = submission === 'native';
    const panelTone = usesNativeSubmit
        ? 'from-primary/16 via-primary/6 to-accent/18'
        : 'from-primary/14 via-primary/6 to-transparent';
    const visibleFields = fields.filter((field) => isFieldVisible(field, fieldValues));

    const renderFieldInput = (field: FormField) => {
        if (field.type === 'textarea') {
            return (
                <Textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    className="min-h-32 rounded-lg shadow-xs"
                />
            );
        }

        if (field.type === 'select') {
            return (
                <>
                    <input
                        type="hidden"
                        name={field.name}
                        value={fieldValues[field.name] ?? ''}
                    />
                    <Select
                        value={fieldValues[field.name] ?? ''}
                        onValueChange={(value) =>
                            setFieldValues((current) => ({
                                ...current,
                                [field.name]: value,
                            }))
                        }
                    >
                        <SelectTrigger
                            id={field.name}
                            className="h-11 w-full rounded-lg shadow-xs"
                        >
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </>
            );
        }

        if (field.type === 'date') {
            const selectedDate = fieldValues[field.name]
                ? parseISO(fieldValues[field.name])
                : undefined;

            return (
                <>
                    <input
                        type="hidden"
                        name={field.name}
                        value={fieldValues[field.name] ?? ''}
                    />
                    <Dialog
                        open={activeDateField === field.name}
                        onOpenChange={(isOpen) =>
                            setActiveDateField(isOpen ? field.name : null)
                        }
                    >
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 w-full justify-between rounded-lg border-border bg-background px-3 font-normal shadow-xs"
                            >
                                <span className={cn(!selectedDate && 'text-muted-foreground')}>
                                    {selectedDate
                                        ? format(selectedDate, 'PPP')
                                        : 'Pick a date'}
                                </span>
                                <CalendarIcon className="size-4 text-muted-foreground" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-fit max-w-fit p-0">
                            <DialogHeader className="px-4 pt-4">
                                <DialogTitle>{field.label}</DialogTitle>
                                <DialogDescription>
                                    Choose the date for this field.
                                </DialogDescription>
                            </DialogHeader>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setFieldValues((current) => ({
                                        ...current,
                                        [field.name]: date
                                            ? format(date, 'yyyy-MM-dd')
                                            : '',
                                    }));
                                    setActiveDateField(null);
                                }}
                                captionLayout="dropdown" className="rounded-b-lg border-t"
                            />
                        </DialogContent>
                    </Dialog>
                </>
            );
        }

        return (
            <Input
                id={field.name}
                name={field.name}
                type={field.type ?? 'text'}
                required={field.required}
                accept={field.type === 'file' ? field.accept : undefined}
                className="h-11 rounded-lg shadow-xs"
            />
        );
    };

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <section className={cn('overflow-hidden rounded-lg border border-border/70 bg-linear-to-br p-6 shadow-sm md:p-8', panelTone)}>
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-linear-to-br from-primary/40 to-background px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                                <FileText className="size-3.5 text-primary" />
                                Hospital workflow
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                                    {title}
                                </h1>
                                <p className="max-w-xl text-xl leading-6 text-muted-foreground md:text-base">
                                    {helperText}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                                <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Fields
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-foreground">
                                    {visibleFields.length}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Structured inputs for this task
                                </p>
                            </div>
                            <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
                                <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                    Submission
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {usesNativeSubmit ? 'Browser download' : 'Inertia form'}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {usesNativeSubmit ? 'Downloads the response immediately after submit.' : 'Keeps the page inside the SPA workflow.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                    <Card className="overflow-hidden rounded-lg border-border/70 bg-card/95 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Entry form</CardTitle>
                            <CardDescription>
                                The form is grouped to keep the data entry flow quick and readable.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {usesNativeSubmit ? (
                                <form
                                    action={action}
                                    method="post"
                                    encType="multipart/form-data"
                                    onSubmit={() => {
                                        setNativeSubmitting(true);
                                        // Reset form fields after a brief delay to allow download to start
                                        setTimeout(() => {
                                            setFieldValues({});
                                            setNativeSubmitting(false);
                                        }, 500);
                                    }}
                                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                                >
                                    <input type="hidden" name="_token" value={csrfToken} />

                                    {method !== 'post' && (
                                        <input type="hidden" name="_method" value={method.toUpperCase()} />
                                    )}

                                    {visibleFields.map((field) => (
                                        <div key={field.name} className={fieldClass(field)}>
                                            <div className="flex items-center justify-between gap-3">
                                                <Label className="text-base" htmlFor={field.name}>{field.label}</Label>
                                                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                                    {fieldTypeLabel(field)}
                                                </span>
                                            </div>
                                            {renderFieldInput(field)}
                                            <InputError message={nativeErrors[field.name]} />
                                        </div>
                                    ))}

                                    <div className="md:col-span-2 xl:col-span-3">
                                        <Button type="submit" size="lg" disabled={nativeSubmitting} className="min-w-52 rounded-lg">
                                            {nativeSubmitting ? 'Preparing download...' : submitLabel}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <Form
                                    action={action}
                                    method={method}
                                    encType="multipart/form-data"
                                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                                >
                                    {({ errors, processing }) => (
                                        <>
                                            {visibleFields.map((field) => (
                                                <div key={field.name} className={fieldClass(field)}>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <Label htmlFor={field.name}>{field.label}</Label>
                                                        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                                            {fieldTypeLabel(field)}
                                                        </span>
                                                    </div>
                                                    {renderFieldInput(field)}
                                                    <InputError message={errors[field.name]} />
                                                </div>
                                            ))}

                                            <div className="md:col-span-2 xl:col-span-3">
                                                <Button type="submit" size="lg" disabled={processing} className="min-w-44 rounded-lg">
                                                    {processing ? 'Saving...' : submitLabel}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="rounded-lg border-border/70 bg-card/95 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Form guide</CardTitle>
                                <CardDescription>
                                    Quick context for how this page behaves.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="rounded-lg border border-border/70 bg-muted/35 p-4">
                                    <p className="font-medium text-foreground">Validation first</p>
                                    <p className="mt-1">The controller validates every field before any record is written.</p>
                                </div>
                                <div className="rounded-lg border border-border/70 bg-muted/35 p-4">
                                    <p className="font-medium text-foreground">Structured save flow</p>
                                    <p className="mt-1">Related records are created in a predictable order so ids and totals stay consistent.</p>
                                </div>
                                <div className="rounded-lg border border-border/70 bg-muted/35 p-4">
                                    <p className="font-medium text-foreground">Frontend result</p>
                                    <p className="mt-1">
                                        {usesNativeSubmit
                                            ? 'Submitting this form uses the browser directly so the TXT credentials file can download automatically.'
                                            : 'Submitting this form keeps the workflow inside the Inertia application.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
