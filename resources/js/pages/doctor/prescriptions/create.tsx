import FormPage from '@/pages/hospital/form-page';
import { store as storeDoctorPrescriptions } from '@/routes/doctor/prescriptions';

export default function CreatePrescriptionPage({ actions, fields }: any) {
  return (
    <FormPage
      title="Create Prescription"
      action={actions.store}
      submission="native"
      fields={fields}
    />
  );
}
