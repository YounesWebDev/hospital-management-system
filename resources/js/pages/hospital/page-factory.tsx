import FormPage from './form-page';
import type { FormField } from './form-page';
import SectionPage from './section-page';

type PageDefaults = {
    title: string;
};

// Keeps page wrappers small while each route still has its own file.
export function createHospitalPage(defaults: PageDefaults) {
    return function HospitalPage(props: Record<string, unknown>) {
        return <SectionPage title={defaults.title} {...props} />;
    };
}

// Creates a typed form page while keeping route page files tiny.
export function createHospitalFormPage(
    defaults: PageDefaults & {
        fields: FormField[];
        method?: 'post' | 'patch';
        submission?: 'inertia' | 'native';
        submitLabel?: string;
        helperText?: string;
    },
) {
    return function HospitalFormPage(props: Record<string, unknown>) {
        const actions = (props.actions ?? {}) as Record<string, string>;
        const action = actions.store ?? actions.update ?? '';
        const resolvedFields = (props.fields ?? defaults.fields) as FormField[];

        return (
            <FormPage
                title={defaults.title}
                action={action}
                method={defaults.method}
                fields={resolvedFields}
                submission={defaults.submission}
                submitLabel={defaults.submitLabel}
                helperText={defaults.helperText}
            />
        );
    };
}
