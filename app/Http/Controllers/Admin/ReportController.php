<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use App\Models\Appointment;
use App\Models\BillingRecord;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\Payment;
use App\Models\Prescription;
use App\Models\StaffProfile;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Show simple admin report totals.
     */
    public function index()
    {
        $stats = [
            'Patients' => PatientProfile::query()->count(),
            'Staff' => StaffProfile::query()->count(),
            'Doctors' => DoctorProfile::query()->count(),
            'Lab requests' => AnalysisRequest::query()->count(),
            'Prescriptions' => Prescription::query()->count(),
            'Appointments' => Appointment::query()->count(),
            'Revenue' => (string) Payment::query()->sum('amount_paid'),
            'Paid bills' => BillingRecord::query()->where('status', 'paid')->count(),
            'Unpaid bills' => BillingRecord::query()->where('status', 'unpaid')->count(),
        ];

        return Inertia::render('admin/reports/index', [
            'title' => 'Reports',
            // Each stat is a quick count or total pulled from one main table.
            'stats' => $stats,
        ]);
    }

    /**
     * Admin overview of appointments.
     */
    public function appointments()
    {
        // Show the newest appointments first so admin can review recent activity quickly.
        return Inertia::render('admin/appointments/index', [
            'title' => 'Appointments',
            'records' => Appointment::query()->latest()->get(),
        ]);
    }

    /**
     * Admin overview of analysis requests.
     */
    public function analyses()
    {
        // Show the newest lab requests first for an operations overview.
        return Inertia::render('admin/analyses/index', [
            'title' => 'Analyses',
            'records' => AnalysisRequest::query()->latest()->get(),
        ]);
    }

    /**
     * Admin overview of billing records.
     */
    public function billing()
    {
        // Show the newest billing records first for finance review.
        return Inertia::render('admin/billing/index', [
            'title' => 'Billing',
            'records' => BillingRecord::query()->latest()->get(),
        ]);
    }

    /**
     * Admin overview of payments.
     */
    public function payments()
    {
        // Show the newest payments first for cashflow tracking.
        return Inertia::render('admin/payments/index', [
            'title' => 'Payments',
            'records' => Payment::query()->latest()->get(),
        ]);
    }
}
