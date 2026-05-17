import FormPage from '@/pages/hospital/form-page';
import { store as storeAccountantPayments } from '@/routes/accountant/payments';

export default function RecordPaymentPage({ actions }: { actions: { store: string } }) {
  return (
    <FormPage
      title="Record Payment"
      action={actions.store}
      submission="native"
      submitLabel="Record Payment"
      helperText="Enter the payment details to update the patient's billing record. A receipt number will be generated automatically."
      fields={[
        { name: 'amount_paid', label: 'Amount paid', type: 'number', required: true },
        {
          name: 'payment_method',
          label: 'Payment method',
          type: 'select',
          required: true,
          options: [
            { label: 'Cash', value: 'cash' },
            { label: 'Card', value: 'card' },
            { label: 'Transfer', value: 'transfer' },
          ],
        },
      ]}
    />
  );
}
