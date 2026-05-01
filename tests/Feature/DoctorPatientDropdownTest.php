<?php

use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('doctor create forms expose patient dropdown options', function () {
    $doctorUser = User::factory()->create([
        'role' => 'doctor',
    ]);

    DoctorProfile::query()->create([
        'user_id' => $doctorUser->id,
        'specialization' => 'General Medicine',
    ]);

    $patientUser = User::factory()->create([
        'role' => 'patient',
        'name' => 'Patient User',
    ]);

    PatientProfile::query()->create([
        'user_id' => $patientUser->id,
        'patient_code' => 'P-00001',
    ]);

    $this->actingAs($doctorUser)
        ->get(route('doctor.prescriptions.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('doctor/prescriptions/create')
            ->has('fields', 6)
            ->where('fields.0.name', 'patient_id')
            ->where('fields.0.type', 'select')
            ->has('fields.0.options', 1)
            ->where('fields.0.options.0.label', 'P-00001 - Patient User')
        );
});
