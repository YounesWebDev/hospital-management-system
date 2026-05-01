<?php

namespace Database\Seeders;

use App\Models\DoctorProfile;
use App\Models\LabTechnicianProfile;
use App\Models\PatientProfile;
use App\Models\StaffProfile;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        // Admin account used to manage staff.
        $admin = User::query()->create([
            'name' => 'Admin User',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@hospital.test',
            'username' => 'admin',
            'password' => $password,
            'role' => 'admin',
            'phone' => '0555000001',
            'status' => 'active',
            'preferred_language' => 'en',
        ]);

        StaffProfile::query()->create([
            'user_id' => $admin->id,
            'salary' => 120000,
            'hire_date' => now()->subYears(3)->toDateString(),
            'address' => 'Main administration office',
        ]);

        // Receptionist account used to register patients.
        $receptionist = User::query()->create([
            'name' => 'Reception User',
            'first_name' => 'Reception',
            'last_name' => 'User',
            'email' => 'reception@hospital.test',
            'username' => 'receptionist',
            'password' => $password,
            'role' => 'receptionist',
            'phone' => '0555000002',
            'status' => 'active',
            'preferred_language' => 'en',
            'created_by' => $admin->id,
        ]);

        StaffProfile::query()->create([
            'user_id' => $receptionist->id,
            'salary' => 60000,
            'hire_date' => now()->subYear()->toDateString(),
            'address' => 'Reception desk',
        ]);

        // Doctor account with a doctor profile.
        $doctor = User::query()->create([
            'name' => 'Doctor User',
            'first_name' => 'Doctor',
            'last_name' => 'User',
            'email' => 'doctor@hospital.test',
            'username' => 'doctor',
            'password' => $password,
            'role' => 'doctor',
            'phone' => '0555000003',
            'status' => 'active',
            'preferred_language' => 'en',
            'created_by' => $admin->id,
        ]);

        StaffProfile::query()->create([
            'user_id' => $doctor->id,
            'salary' => 150000,
            'hire_date' => now()->subYears(2)->toDateString(),
            'address' => 'Doctor office',
        ]);

        DoctorProfile::query()->create([
            'user_id' => $doctor->id,
            'specialization' => 'General Medicine',
        ]);

        // Lab technician account with a lab profile.
        $labTechnician = User::query()->create([
            'name' => 'Lab User',
            'first_name' => 'Lab',
            'last_name' => 'User',
            'email' => 'lab@hospital.test',
            'username' => 'labtech',
            'password' => $password,
            'role' => 'lab_technician',
            'phone' => '0555000004',
            'status' => 'active',
            'preferred_language' => 'en',
            'created_by' => $admin->id,
        ]);

        StaffProfile::query()->create([
            'user_id' => $labTechnician->id,
            'salary' => 70000,
            'hire_date' => now()->subYear()->toDateString(),
            'address' => 'Laboratory',
        ]);

        LabTechnicianProfile::query()->create([
            'user_id' => $labTechnician->id,
            'department' => 'Clinical Laboratory',
        ]);

        // Accountant account used to record payments.
        $accountant = User::query()->create([
            'name' => 'Accountant User',
            'first_name' => 'Accountant',
            'last_name' => 'User',
            'email' => 'accountant@hospital.test',
            'username' => 'accountant',
            'password' => $password,
            'role' => 'accountant',
            'phone' => '0555000005',
            'status' => 'active',
            'preferred_language' => 'en',
            'created_by' => $admin->id,
        ]);

        StaffProfile::query()->create([
            'user_id' => $accountant->id,
            'salary' => 80000,
            'hire_date' => now()->subYear()->toDateString(),
            'address' => 'Accounting office',
        ]);

        // Patient account registered by reception.
        $patient = User::query()->create([
            'name' => 'Patient User',
            'first_name' => 'Patient',
            'last_name' => 'User',
            'email' => 'patient@hospital.test',
            'username' => 'patient',
            'password' => $password,
            'role' => 'patient',
            'phone' => '0555000006',
            'status' => 'active',
            'preferred_language' => 'en',
            'created_by' => $receptionist->id,
        ]);

        PatientProfile::query()->create([
            'user_id' => $patient->id,
            'patient_code' => 'P-00001',
            'gender' => 'male',
            'birth_date' => now()->subYears(30)->toDateString(),
            'address' => 'Demo patient address',
            'emergency_contact' => '0555999999',
            'registered_by' => $receptionist->id,
        ]);

        // Basic settings used by later screens.
        DB::table('system_settings')->insert([
            ['setting_key' => 'clinic_name', 'setting_value' => 'HospitalCare', 'created_at' => now(), 'updated_at' => now()],
            ['setting_key' => 'currency', 'setting_value' => 'DZD', 'created_at' => now(), 'updated_at' => now()],
            ['setting_key' => 'default_language', 'setting_value' => 'en', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
