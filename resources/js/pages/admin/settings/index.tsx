import { createHospitalFormPage } from '@/pages/hospital/page-factory';
import SectionPage from '@/pages/hospital/section-page';

const SettingsForm = createHospitalFormPage({
    title: 'Update Setting',
    fields: [
        { name: 'setting_key', label: 'Setting key', required: true },
        { name: 'setting_value', label: 'Setting value', type: 'textarea' },
    ],
});

export default function SettingsPage(props: Record<string, unknown>) {
    return (
        <div className="space-y-8">
            <SettingsForm {...props} />
            <SectionPage title="System Settings" {...props} />
        </div>
    );
}
