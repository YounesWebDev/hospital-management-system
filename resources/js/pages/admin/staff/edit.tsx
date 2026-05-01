import { createHospitalFormPage } from '@/pages/hospital/page-factory';

export default createHospitalFormPage({
    title: 'Edit Staff Account',
    method: 'patch',
    fields: [
        { name: 'phone', label: 'Phone' },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
            ],
        },
    ],
});
