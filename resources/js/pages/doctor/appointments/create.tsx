import FormPage from '@/pages/hospital/form-page';
import { store as storeDoctorAppointments } from '@/routes/doctor/appointments';

export default function CreateAppointmentPage({
    fields = [],
}) {
  return (
    <FormPage
      title="Create Appointment"
      action={storeDoctorAppointments.form().action}
      submission="native"
      fields={fields}
    />
  );
}
