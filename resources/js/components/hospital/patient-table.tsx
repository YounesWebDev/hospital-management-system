import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type PatientRow = {
    id?: number;
    code?: string | null;
    name?: string | null;
    email?: string | null;
};

type PatientTableProps = {
    patients: PatientRow[];
};

// Basic reusable table for patient lists.
export function PatientTable({ patients }: PatientTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {patients.map((patient, index) => (
                    <TableRow key={patient.id ?? index}>
                        <TableCell>{patient.code ?? '-'}</TableCell>
                        <TableCell>{patient.name ?? '-'}</TableCell>
                        <TableCell>{patient.email ?? '-'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
