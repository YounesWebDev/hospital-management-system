<?php

use App\Models\CredentialExport;
use App\Models\PatientProfile;
use App\Models\StaffProfile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can open the staff creation page', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.staff.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/staff/create')
            ->where('title', 'Create Staff Account')
            ->where('actions.store', route('admin.staff.store'))
        );
});

test('admin staff creation downloads a credential text file', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.staff.store'), [
        'first_name' => 'Maya',
        'last_name' => 'Stone',
        'email' => 'maya.staff@example.com',
        'username' => 'maya.staff',
        'phone' => '555-0100',
        'role' => 'doctor',
        'salary' => 80000,
        'hire_date' => '2026-04-29',
        'specialization' => 'Cardiology',
        'address' => 'Main campus',
    ]);

    $response
        ->assertOk()
        ->assertDownload('staff-credentials.txt')
        ->assertSeeText('Clinic System Credentials')
        ->assertSeeText('Temporary Password:');

    $staffUser = User::query()->where('email', 'maya.staff@example.com')->firstOrFail();

    expect($staffUser->role)->toBe('doctor')
        ->and(StaffProfile::query()->where('user_id', $staffUser->id)->exists())->toBeTrue()
        ->and(CredentialExport::query()->where('user_id', $staffUser->id)->where('export_type', 'staff')->exists())->toBeTrue();
});

test('receptionist patient pages render through inertia', function () {
    $receptionist = User::factory()->create([
        'role' => 'receptionist',
    ]);

    $patientUser = User::factory()->create([
        'role' => 'patient',
        'name' => 'Nora Wells',
        'email' => 'nora.patient@example.com',
        'username' => 'nora.patient',
    ]);

    $patientProfile = PatientProfile::query()->create([
        'user_id' => $patientUser->id,
        'patient_code' => 'P-00001',
        'registered_by' => $receptionist->id,
    ]);

    $this->actingAs($receptionist)
        ->get(route('receptionist.patients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('receptionist/patients/index')
            ->where('title', 'Patient Registration')
            ->has('records', 1)
            ->where('actions.create', route('receptionist.patients.create'))
        );

    $this->actingAs($receptionist)
        ->get(route('receptionist.patients.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('receptionist/patients/create')
            ->where('title', 'Register Patient')
            ->where('actions.store', route('receptionist.patients.store'))
        );

    $this->actingAs($receptionist)
        ->get(route('receptionist.patients.show', $patientProfile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('receptionist/patients/show')
            ->where('title', 'Patient Profile')
            ->has('records', 1)
        );
});

test('receptionist patient creation downloads a credential text file', function () {
    $receptionist = User::factory()->create([
        'role' => 'receptionist',
    ]);

    $response = $this->actingAs($receptionist)->post(route('receptionist.patients.store'), [
        'first_name' => 'Sara',
        'last_name' => 'Young',
        'email' => 'sara.patient@example.com',
        'username' => 'sara.patient',
        'phone' => '555-0101',
        'gender' => 'female',
        'birth_date' => '1998-05-10',
        'address' => 'North wing',
        'emergency_contact' => 'Amina Young',
    ]);

    $response
        ->assertOk()
        ->assertDownload('patient-credentials.txt')
        ->assertSeeText('Patient Credentials')
        ->assertSeeText('Temporary Password:');

    $patientUser = User::query()->where('email', 'sara.patient@example.com')->firstOrFail();
    $patientProfile = PatientProfile::query()->where('user_id', $patientUser->id)->firstOrFail();

    expect($patientUser->role)->toBe('patient')
        ->and($patientProfile->registered_by)->toBe($receptionist->id)
        ->and(CredentialExport::query()->where('user_id', $patientUser->id)->where('export_type', 'patient')->exists())->toBeTrue();
});
