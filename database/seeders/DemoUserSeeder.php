<?php

namespace Database\Seeders;

use App\Models\AnalysisRequest;
use App\Models\Appointment;
use App\Models\BillingItem;
use App\Models\BillingRecord;
use App\Models\DoctorProfile;
use App\Models\LabTechnicianProfile;
use App\Models\Payment;
use App\Models\PatientProfile;
use App\Models\Prescription;
use App\Models\PrescriptionItem;
use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
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

        $doctorProfile = DoctorProfile::query()->create([
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

        $accountantProfile = StaffProfile::query()->create([
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

        $patientProfile = PatientProfile::query()->create([
            'user_id' => $patient->id,
            'patient_code' => 'P-00001',
            'gender' => 'male',
            'birth_date' => now()->subYears(30)->toDateString(),
            'address' => 'Demo patient address',
            'emergency_contact' => '0555999999',
            'registered_by' => $receptionist->id,
        ]);

        // Additional test patient
        $patient2 = User::query()->create([
            'name' => 'John Doe',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'username' => 'johndoe',
            'password' => $password,
            'role' => 'patient',
            'phone' => '0555000007',
            'status' => 'active',
            'preferred_language' => 'en',
            'created_by' => $receptionist->id,
        ]);

        $patientProfile2 = PatientProfile::query()->create([
            'user_id' => $patient2->id,
            'patient_code' => 'P-00002',
            'gender' => 'male',
            'birth_date' => now()->subYears(45)->toDateString(),
            'address' => 'Patient 2 address',
            'emergency_contact' => '0555888888',
            'registered_by' => $receptionist->id,
        ]);

        // Doctor's Appointments
        $appts = [
            [
                'patient_id' => $patientProfile->id,
                'doctor_id' => $doctorProfile->id,
                'type' => 'Consultation',
                'appointment_date' => now()->subDays(1)->toDateString(),
                'appointment_time' => '10:00',
                'status' => 'completed',
                'notes' => 'Initial checkup',
            ],
            [
                'patient_id' => $patientProfile2->id,
                'doctor_id' => $doctorProfile->id,
                'type' => 'Follow-up',
                'appointment_date' => now()->addDays(2)->toDateString(),
                'appointment_time' => '14:30',
                'status' => 'scheduled',
                'notes' => 'Review test results',
            ],
            [
                'patient_id' => $patientProfile->id,
                'doctor_id' => $doctorProfile->id,
                'type' => 'Routine',
                'appointment_date' => now()->subDays(5)->toDateString(),
                'appointment_time' => '09:00',
                'status' => 'cancelled',
                'notes' => 'Patient cancelled',
            ],
        ];

        foreach ($appts as $aptData) {
            Appointment::query()->create($aptData);
        }

        // For the completed appointment, create a prescription and analysis request
        $completedApt = Appointment::where('status', 'completed')->first();
        if ($completedApt) {
            $prescription = Prescription::query()->create([
                'patient_id' => $completedApt->patient_id,
                'doctor_id' => $doctorProfile->id,
                'diagnosis' => 'Common Cold',
                'instructions' => 'Take medicines as prescribed and rest.',
            ]);

            PrescriptionItem::query()->create([
                'prescription_id' => $prescription->id,
                'medicine_name' => 'Paracetamol',
                'dosage' => '500mg',
                'duration' => '5 days',
                'instructions' => 'Twice a day after meals',
            ]);

            PrescriptionItem::query()->create([
                'prescription_id' => $prescription->id,
                'medicine_name' => 'Cough Syrup',
                'dosage' => '10ml',
                'duration' => '3 days',
                'instructions' => 'Once a day before bed',
            ]);

            AnalysisRequest::query()->create([
                'patient_id' => $completedApt->patient_id,
                'doctor_id' => $doctorProfile->id,
                'analysis_type' => 'Blood Test',
                'description' => 'Check for infection markers',
                'status' => 'completed',
                'requested_at' => now()->subDay(),
                'started_at' => now()->subDay()->addHours(2),
                'completed_at' => now()->subDay()->addHours(5),
            ]);

            $bill = BillingRecord::query()->create([
                'patient_id' => $completedApt->patient_id,
                'doctor_id' => $doctorProfile->id,
                'total_amount' => 150.00,
                'paid_amount' => 100.00,
                'remaining_amount' => 50.00,
                'status' => 'partially_paid',
            ]);

            BillingItem::query()->create([
                'billing_record_id' => $bill->id,
                'item_type' => 'Consultation',
                'description' => 'General Consultation Fee',
                'amount' => 100.00,
                'added_by' => $doctor->id,
            ]);

            BillingItem::query()->create([
                'billing_record_id' => $bill->id,
                'item_type' => 'Service',
                'description' => 'Administrative Fee',
                'amount' => 50.00,
                'added_by' => $doctor->id,
            ]);

            Payment::query()->create([
                'billing_record_id' => $bill->id,
                'patient_id' => $completedApt->patient_id,
                'accountant_id' => $accountantProfile->id,
                'amount_paid' => 100.00,
                'payment_method' => 'cash',
                'receipt_number' => 'REC-001',
                'paid_at' => now()->subDay(),
            ]);
        }
    }
}
