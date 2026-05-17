import FormPage from '@/pages/hospital/form-page';
import { update as updateAdminStaff } from '@/routes/admin/staff';

export default function EditStaffPage() {
  return (
    <FormPage
      title="Edit Staff Account"
      action={updateAdminStaff(1).url}
      method="patch"
      fields={[
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
      ]}
    />
  );
}

