import { createHospitalFormPage } from '@/pages/hospital/page-factory';

export default createHospitalFormPage({
    title: 'Create Prescription',
    fields: [
        { name: 'patient_id', label: 'Patient ID', type: 'number', required: true },
        { name: 'diagnosis', label: 'Diagnosis', type: 'textarea' },
        { name: 'medicine_name', label: 'Medicine name', required: true },
        { name: 'dosage', label: 'Dosage' },
        { name: 'duration', label: 'Duration' },
        { name: 'instructions', label: 'Instructions', type: 'textarea' },
    ],
});
