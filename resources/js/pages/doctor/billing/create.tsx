import { createHospitalFormPage } from '@/pages/hospital/page-factory';

export default createHospitalFormPage({
    title: 'Add Billing Item',
    fields: [
        { name: 'patient_id', label: 'Patient ID', type: 'number', required: true },
        {
            name: 'item_type',
            label: 'Item type',
            type: 'select',
            required: true,
            options: [
                { label: 'Consultation', value: 'consultation' },
                { label: 'Analysis', value: 'analysis' },
                { label: 'Operation', value: 'operation' },
                { label: 'Room stay', value: 'room_stay' },
                { label: 'Other', value: 'other' },
            ],
        },
        { name: 'description', label: 'Description', required: true },
        { name: 'amount', label: 'Amount', type: 'number', required: true },
    ],
});
