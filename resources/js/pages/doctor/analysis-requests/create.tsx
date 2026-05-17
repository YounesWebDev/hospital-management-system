import FormPage from '@/pages/hospital/form-page';
import { store as storeDoctorAnalysisRequests } from '@/routes/doctor/analysis-requests';

export default function RequestAnalysisPage({ actions, fields }: any) {
  return (
    <FormPage
      title="Request Analysis"
      action={actions.store}
      submission="native"
      fields={fields}
    />
  );
}
