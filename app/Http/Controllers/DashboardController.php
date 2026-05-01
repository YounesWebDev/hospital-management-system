<?php

namespace App\Http\Controllers;

use App\Models\AnalysisRequest;
use App\Models\Appointment;
use App\Models\BillingRecord;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\Payment;
use App\Models\StaffProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show a role dashboard with simple counts.
     */
    public function __invoke(Request $request)
    {
        $role = $request->user()->role;
        $page = "{$this->pagePrefix($role)}/dashboard";
        $stats = $this->statsFor($role);
        $title = Str::of($role)->replace('_', ' ')->title()->append(' Dashboard')->toString();

        return Inertia::render($page, [
            'title' => $title,
            // These numbers give each role a quick summary of the work they care about.
            'stats' => $stats,
        ]);
    }

    /**
     * Match database role names to page folders.
     */
    private function pagePrefix(string $role): string
    {
        return match ($role) {
            'lab_technician' => 'lab',
            default => $role,
        };
    }

    /**
     * Dashboard numbers stay simple until advanced reports are added.
     *
     * @return array<string, int|string>
     */
    private function statsFor(string $role): array
    {
        $staffProfilesTable = (new StaffProfile())->getTable();
        $patientProfilesTable = (new PatientProfile())->getTable();
        $doctorProfilesTable = (new DoctorProfile())->getTable();
        $analysisRequestsTable = (new AnalysisRequest())->getTable();
        $appointmentsTable = (new Appointment())->getTable();
        $paymentsTable = (new Payment())->getTable();
        $billingRecordsTable = (new BillingRecord())->getTable();

        // Each role sees a small set of counts built from the tables it uses most.
        return match ($role) {
            'admin' => [
                'Staff' => DB::table($staffProfilesTable)->count(),
                'Patients' => DB::table($patientProfilesTable)->count(),
                'Doctors' => DB::table($doctorProfilesTable)->count(),
                'Lab requests' => DB::table($analysisRequestsTable)->count(),
                'Revenue' => (string) DB::table($paymentsTable)->sum('amount_paid'),
            ],
            'receptionist' => [
                'Patients' => DB::table($patientProfilesTable)->count(),
                'New today' => DB::table($patientProfilesTable)
                    ->whereDate('created_at', Carbon::today())
                    ->count(),
                'Appointments' => DB::table($appointmentsTable)
                    ->where('status', 'scheduled')
                    ->count(),
            ],
            'doctor' => [
                'Patients' => DB::table($patientProfilesTable)->count(),
                'Pending analyses' => DB::table($analysisRequestsTable)
                    ->where('status', 'requested')
                    ->count(),
                'Appointments' => DB::table($appointmentsTable)
                    ->where('status', 'scheduled')
                    ->count(),
            ],
            'lab_technician' => [
                'Requested' => DB::table($analysisRequestsTable)
                    ->where('status', 'requested')
                    ->count(),
                'In progress' => DB::table($analysisRequestsTable)
                    ->where('status', 'in_progress')
                    ->count(),
                'Completed' => DB::table($analysisRequestsTable)
                    ->where('status', 'completed')
                    ->count(),
            ],
            'accountant' => [
                'Today revenue' => (string) DB::table($paymentsTable)
                    ->whereDate('paid_at', Carbon::today())
                    ->sum('amount_paid'),
                'Unpaid bills' => DB::table($billingRecordsTable)
                    ->where('status', 'unpaid')
                    ->count(),
                'Partial bills' => DB::table($billingRecordsTable)
                    ->where('status', 'partially_paid')
                    ->count(),
            ],
            default => [
                'Appointments' => DB::table($appointmentsTable)
                    ->where('status', 'scheduled')
                    ->count(),
                'Prescriptions' => 0,
                'Unpaid bills' => DB::table($billingRecordsTable)
                    ->where('status', 'unpaid')
                    ->count(),
            ],
        };
    }
}
