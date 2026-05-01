<?php

use App\Models\DoctorProfile;
use App\Models\MedicalNote;
use App\Models\PatientProfile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('doctor patient search returns an inertia page', function () {
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
        'email' => 'patient@hospital.test',
        'username' => 'patient.user',
    ]);

    PatientProfile::query()->create([
        'user_id' => $patientUser->id,
        'patient_code' => 'P-00001',
    ]);

    $this->actingAs($doctorUser)
        ->get(route('doctor.patients.search', ['search' => 'Patient']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('doctor/patients/search')
            ->where('title', 'Find Patient File')
            ->where('search', 'Patient')
            ->has('patients', 1)
            ->where('patients.0.code', 'P-00001')
        );
});

test('doctor patient file returns an inertia page', function () {
    $doctorUser = User::factory()->create([
        'role' => 'doctor',
    ]);

    $doctorProfile = DoctorProfile::query()->create([
        'user_id' => $doctorUser->id,
        'specialization' => 'General Medicine',
    ]);

    $patientUser = User::factory()->create([
        'role' => 'patient',
        'name' => 'Patient User',
    ]);

    $patientProfile = PatientProfile::query()->create([
        'user_id' => $patientUser->id,
        'patient_code' => 'P-00001',
    ]);

    MedicalNote::query()->create([
        'patient_id' => $patientProfile->id,
        'doctor_id' => $doctorProfile->id,
        'note' => 'Initial assessment note.',
    ]);

    $this->actingAs($doctorUser)
        ->get(route('doctor.patients.show', $patientProfile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('doctor/patients/show')
            ->where('title', 'Patient Medical File')
            ->where('patient.code', 'P-00001')
            ->where('summary.notes', 1)
            ->has('medicalNotes', 1)
            ->where('actions.note', route('doctor.medical-notes.store'))
        );
});

test('doctor can store a medical note and is redirected back', function () {
    $doctorUser = User::factory()->create([
        'role' => 'doctor',
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

    $response = $this->actingAs($doctorUser)
        ->from(route('doctor.patients.show', $patientProfile))
        ->post(route('doctor.medical-notes.store'), [
            'patient_id' => $patientProfile->id,
            'note' => 'Follow-up note.',
        ]);

    $response->assertRedirect(route('doctor.patients.show', $patientProfile));

    $note = MedicalNote::query()->where('patient_id', $patientProfile->id)->firstOrFail();

    expect($note->doctor_id)->toBe($doctorProfile->id)
        ->and($note->note)->toBe('Follow-up note.');
});
