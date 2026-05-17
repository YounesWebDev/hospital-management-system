import FormPage from '@/pages/hospital/form-page';
import { store as storeDoctorAppointments } from '@/routes/doctor/appointments';

export default function CreateAppointmentPage() {
  return (
    <FormPage
      title="Create Appointment"
      action={storeDoctorAppointments.form().action}
      submission="native"
      fields={[
        { name: 'patient_id', label: 'Patient ID', type: 'number', required: true },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Regular', value: 'regular' },
            { label: 'Operation', value: 'operation' },
          ],
        },
        { name: 'appointment_date', label: 'Date', type: 'date', required: true },
        { name: 'appointment_time', label: 'Time', type: 'time', required: true },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
