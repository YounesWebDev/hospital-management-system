import { StatusBadge } from '@/components/hospital/status-badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type AppointmentRow = {
    id?: number;
    patient?: string | null;
    date?: string | null;
    time?: string | null;
    status?: string | null;
};

type AppointmentTableProps = {
    appointments: AppointmentRow[];
};

// Reusable appointment table for admin, doctor, receptionist, and patient pages.
export function AppointmentTable({ appointments }: AppointmentTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map((appointment, index) => (
                    <TableRow key={appointment.id ?? index}>
                        <TableCell>{appointment.patient ?? '-'}</TableCell>
                        <TableCell>{appointment.date ?? '-'}</TableCell>
                        <TableCell>{appointment.time ?? '-'}</TableCell>
                        <TableCell>
                            <StatusBadge status={appointment.status} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
