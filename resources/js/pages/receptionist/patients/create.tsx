import FormPage from '@/pages/hospital/form-page';
import { store as storeReceptionistPatients } from '@/routes/receptionist/patients';

export default function RegisterPatientPage() {
  return (
    <FormPage
      title="Register Patient"
      action={storeReceptionistPatients.url()}
      submission="native"
      submitLabel="Register and download credentials"
      helperText="Register the patient account and automatically download the TXT credentials file after the record is created."
      fields={[
        { name: 'first_name', label: 'First name', required: true },
        { name: 'last_name', label: 'Last name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'phone', label: 'Phone' },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        { name: 'birth_date', label: 'Birth date', type: 'date' },
        { name: 'emergency_contact', label: 'Emergency contact' },
        { name: 'address', label: 'Address', type: 'textarea' },
      ]}
    />
  );
}