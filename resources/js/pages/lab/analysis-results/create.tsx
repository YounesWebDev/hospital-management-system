import FormPage from '@/pages/hospital/form-page';

interface Props {
    title: string;
    records: any[];
    actions?: {
        store?: string | any;
    };
}

export default function UploadAnalysisResultPage({ records = [], actions = {} }: Props) {
  return (
    <FormPage
      title="Upload Analysis Result"
      action={actions.store}
      submission="native"
      submitLabel="Submit Result"
      helperText="Record the final analysis results and upload any supporting documentation for the patient's medical record."
      fields={[
        { name: 'result_text', label: 'Result text', type: 'textarea', required: true },
        {
          name: 'result_file',
          label: 'Analysis result file',
          type: 'file',
          accept: '.pdf,.doc,.docx,image/*'
        },
      ]}
    />
  );
}
