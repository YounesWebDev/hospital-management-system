<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Inertia\Inertia;

class PatientDashboardController extends Controller
{
    /**
     * Show the patient dashboard.
     */
    public function __invoke()
    {
        // Load the current patient's related records so the dashboard can show quick counts.
        $patient = PatientProfile::query()
            ->where('user_id', auth()->id())
            ->with(['appointments', 'prescriptions', 'analysisRequests.result', 'billingRecords'])
            ->first();

        $stats = [
            'Appointments' => $patient?->appointments->count() ?? 0,
            'Prescriptions' => $patient?->prescriptions->count() ?? 0,
            'Analyses' => $patient?->analysisRequests->count() ?? 0,
            'Bills' => $patient?->billingRecords->count() ?? 0,
        ];

        return Inertia::render('patient/dashboard', [
            'title' => 'Patient Dashboard',
            // These counters summarize the patient's current medical activity.
            'stats' => $stats,
        ]);
    }
}
