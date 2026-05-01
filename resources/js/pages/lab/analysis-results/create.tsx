import { createHospitalFormPage } from '@/pages/hospital/page-factory';

export default createHospitalFormPage({
    title: 'Upload Analysis Result',
    fields: [
        { name: 'result_text', label: 'Result text', type: 'textarea' },
        { name: 'result_file', label: 'PDF or image result', type: 'file' },
    ],
});
