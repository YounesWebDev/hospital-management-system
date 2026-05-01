import { createHospitalFormPage } from '@/pages/hospital/page-factory';

export default createHospitalFormPage({
    title: 'Create Staff Account',
    submission: 'native',
    submitLabel: 'Create and download credentials',
    helperText:
        'Create a staff account and immediately download the TXT credentials file for handoff or printing.',
    fields: [
        { name: 'first_name', label: 'First name', required: true },
        { name: 'last_name', label: 'Last name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'phone', label: 'Phone' },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            required: true,
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Receptionist', value: 'receptionist' },
                { label: 'Doctor', value: 'doctor' },
                { label: 'Lab Technician', value: 'lab_technician' },
                { label: 'Accountant', value: 'accountant' },
            ],
        },
        { name: 'salary', label: 'Salary', type: 'number' },
        { name: 'hire_date', label: 'Hire date', type: 'date' },
        {
            name: 'specialization',
            label: 'Doctor specialization',
            visibleWhen: { field: 'role', equals: 'doctor' },
        },
        {
            name: 'department',
            label: 'Lab department',
            visibleWhen: { field: 'role', equals: 'lab_technician' },
        },
        { name: 'address', label: 'Address', type: 'textarea' },
    ],
});
