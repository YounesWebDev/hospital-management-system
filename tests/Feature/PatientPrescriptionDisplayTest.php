<?php

use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\Prescription;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('patient prescriptions page exposes medicine and prescribing doctor separately', function () {
    $doctorUser = User::factory()->create([
        'role' => 'doctor',
        'name' => 'Dr Smith',
    ]);

    $doctorProfile = DoctorProfile::query()->create([
        'user_id' => $doctorUser->id,
        'specialization' => 'General Medicine',
    ]);

    $patientUser = User::factory()->create([
        'role' => 'patient',
    ]);

    $patientProfile = PatientProfile::query()->create([
        'user_id' => $patientUser->id,
        'patient_code' => 'P-00001',
    ]);

    $prescription = Prescription::query()->create([
        'patient_id' => $patientProfile->id,
        'doctor_id' => $doctorProfile->id,
        'diagnosis' => 'Seasonal flu',
        'instructions' => 'Take after meals',
    ]);

    $prescription->items()->create([
        'medicine_name' => 'Paracetamol',
        'dosage' => '500mg',
        'duration' => '5 days',
    ]);

    $this->actingAs($patientUser)
        ->get(route('patient.prescriptions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('patient/prescriptions/index')
            ->where('prescriptions.0.medicine', 'Paracetamol')
            ->where('prescriptions.0.doctor', 'Dr Smith')
        );
});
