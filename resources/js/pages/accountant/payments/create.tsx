import { createHospitalFormPage } from '@/pages/hospital/page-factory';

export default createHospitalFormPage({
    title: 'Record Payment',
    fields: [
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
    ],
});
