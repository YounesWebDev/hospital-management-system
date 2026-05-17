import FormPage from '@/pages/hospital/form-page';
import { store as storeDoctorBilling } from '@/routes/doctor/billing';

export default function AddBillingItemPage({ actions, fields }: any) {
  return (
    <FormPage
      title="Add Billing Item"
      action={actions.store}
      submission="native"
      fields={fields}
    />
  );
}
