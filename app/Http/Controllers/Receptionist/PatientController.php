<?php

namespace App\Http\Controllers\Receptionist;

use App\Http\Controllers\Controller;
use App\Models\CredentialExport;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PatientController extends Controller
{
    /**
     * Show patient list for reception.
     */
    public function index()
    {
        // Get all patient profiles with only the user columns needed for the reception list.
        $patients = PatientProfile::query()
            ->with('user:id,name,email,username,status')
            ->latest()
            ->get()
            // Shape each profile into a simple JSON row for the patients table.
            ->map(fn (PatientProfile $patient): array => [
                'id' => $patient->id,
                'code' => $patient->patient_code,
                'name' => $patient->user?->name,
                'email' => $patient->user?->email,
                'status' => $patient->user?->status,
            ]);

        return Inertia::render('receptionist/patients/index', [
            'title' => 'Patient Registration',
            'records' => $patients,
            'actions' => [
                'create' => route('receptionist.patients.create'),
            ],
        ]);
    }

    /**
     * Show patient creation page.
     */
    public function create()
    {
        return Inertia::render('receptionist/patients/create', [
            'title' => 'Register Patient',
            'records' => [],
            'actions' => [
                'store' => route('receptionist.patients.store'),
            ],
        ]);
    }

    /**
     * Create a patient account and return TXT credentials.
     */
    public function store(Request $request)
    {
        // Validate the registration form before creating any records.
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'email' => ['required', 'email', 'unique:users,email'],
            'username' => ['required', 'string', 'max:191', 'unique:users,username'],
            'phone' => ['nullable', 'string', 'max:191'],
            'gender' => ['nullable', 'string', 'max:191'],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'emergency_contact' => ['nullable', 'string', 'max:191'],
        ]);

        $temporaryPassword = Str::password(10);

        [$user, $profile] = DB::transaction(function () use ($data, $temporaryPassword): array {
            // Create the login account first because the patient profile depends on user_id.
            $user = User::query()->create([
                'name' => $data['first_name'].' '.$data['last_name'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => Str::lower($data['email']),
                'username' => Str::lower($data['username']),
                'password' => Hash::make($temporaryPassword),
                'role' => 'patient',
                'phone' => $data['phone'] ?? null,
                'status' => 'active',
                'preferred_language' => 'en',
                'must_change_password' => true,
                'created_by' => $this->currentUserId(),
            ]);

            // Create the patient profile with medical-registration fields used by the clinic.
            $profile = PatientProfile::query()->create([
                'user_id' => $user->id,
                'patient_code' => 'P-'.str_pad((string) (DB::table((new PatientProfile())->getTable())->count() + 1), 5, '0', STR_PAD_LEFT),
                'gender' => $data['gender'] ?? null,
                'birth_date' => $data['birth_date'] ?? null,
                'address' => $data['address'] ?? null,
                'emergency_contact' => $data['emergency_contact'] ?? null,
                'registered_by' => $this->currentUserId(),
            ]);

            // Track that credentials were generated for this patient account.
            CredentialExport::query()->create([
                'user_id' => $user->id,
                'generated_by' => $this->currentUserId(),
                'export_type' => 'patient',
                'exported_at' => now(),
            ]);

            $this->audit('created_patient', 'patient_profiles', $profile->id, "Registered {$profile->patient_code}");

            return [$user, $profile];
        });

        // Return a plain text file so reception can print or hand over the credentials.
        return response($this->credentialText($user, $profile, $temporaryPassword), 200, [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => 'attachment; filename="patient-credentials.txt"',
        ]);
    }

    /**
     * Show a patient profile page.
     */
    public function show(PatientProfile $patient)
    {
        // Load the linked user account so the response can include contact and account status.
        $patient->load('user:id,name,email,username,phone,status');

        return Inertia::render('receptionist/patients/show', [
            'title' => 'Patient Profile',
            'records' => [[
                'code' => $patient->patient_code,
                'name' => $patient->user?->name,
                'email' => $patient->user?->email,
                'phone' => $patient->user?->phone,
                'status' => $patient->user?->status,
            ]],
        ]);
    }

    /**
     * Build the patient credential TXT file.
     */
    private function credentialText(User $user, PatientProfile $profile, string $temporaryPassword): string
    {
        // Build a simple printable text block instead of returning raw JSON credentials.
        return "Patient Credentials\n\n"
            ."Patient ID: {$profile->patient_code}\n"
            ."Full Name: {$user->name}\n"
            ."Email: {$user->email}\n"
            ."Username: {$user->username}\n"
            ."Temporary Password: {$temporaryPassword}\n\n"
            ."Use these credentials to login.\n"
            .'Please change your password after first login.';
    }
}
