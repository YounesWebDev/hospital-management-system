import { createHospitalFormPage } from '@/pages/hospital/page-factory';
import SectionPage from '@/pages/hospital/section-page';

const ReminderForm = createHospitalFormPage({
    title: 'Send Appointment Reminder',
    fields: [
        {
            name: 'receiver_id',
            label: 'Patient user ID',
            type: 'number',
            required: true,
        },
        { name: 'title', label: 'Title', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true },
    ],
});

export default function NotificationsPage(props: Record<string, unknown>) {
    return (
        <div className="space-y-8">
            <ReminderForm {...props} />
            <SectionPage title="Sent Notifications" {...props} />
        </div>
    );
}
