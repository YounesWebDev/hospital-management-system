<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;

class PatientController extends Controller
{
    /**
     * Admin read-only patient list.
     */
    public function index()
    {
        // Load patient profiles with only the user columns needed in the admin list.
        $patients = PatientProfile::query()
            ->with('user:id,name,email,username,status')
            ->latest()
            ->get()
            // Convert the models into a simple JSON shape for the frontend table.
            ->map(fn (PatientProfile $patient): array => [
                'code' => $patient->patient_code,
                'name' => $patient->user?->name,
                'email' => $patient->user?->email,
                'status' => $patient->user?->status,
            ]);

        return $this->hospitalPage('admin/patients/index', 'Patients', $patients);
    }
}
