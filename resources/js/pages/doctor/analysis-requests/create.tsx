import { createHospitalFormPage } from '@/pages/hospital/page-factory';

export default createHospitalFormPage({
    title: 'Request Analysis',
    fields: [
        { name: 'patient_id', label: 'Patient ID', type: 'number', required: true },
        { name: 'analysis_type', label: 'Analysis type', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
    ],
});
