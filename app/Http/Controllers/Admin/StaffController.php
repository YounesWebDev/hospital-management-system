<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CredentialExport;
use App\Models\DoctorProfile;
use App\Models\LabTechnicianProfile;
use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    /**
     * Show all staff accounts.
     */
    public function index(): Response
    {
        $staff = User::query()
            ->whereIn('role', [
                'admin',
                'receptionist',
                'doctor',
                'lab_technician',
                'accountant'
            ], 'and', false)
            ->orderBy('created_at', 'desc')
            ->get();

        $staff = $staff->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'role' => $user->role,
                'status' => $user->status,
            ];
        });

        return Inertia::render('admin/staff/index', [
            'title' => 'Staff Accounts',
            'records' => $staff,
            'actions' => [
                'create' => route('admin.staff.create'),
            ],
        ]);
    }

    /**
     * Show the staff creation page.
     */
    public function create(): Response
    {
        return Inertia::render('admin/staff/create', [
            'title' => 'Create Staff Account',
            'actions' => [
                'store' => route('admin.staff.store'),
            ],
        ]);
    }

    /**
     * Store a staff account and return TXT credentials.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:191'],
            'last_name' => ['required', 'string', 'max:191'],
            'email' => ['required', 'email', 'unique:users,email'],
            'username' => ['required', 'string', 'max:191', 'unique:users,username'],
            'phone' => ['nullable', 'string', 'max:191'],
            'role' => ['required', 'in:admin,receptionist,doctor,lab_technician,accountant'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'hire_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'specialization' => ['nullable', 'string', 'max:191'],
            'department' => ['nullable', 'string', 'max:191'],
        ]);

        $temporaryPassword = Str::random(10);

        $user = DB::transaction(function () use ($data, $temporaryPassword): User {

            $user = User::query()->create([
                'name' => $data['first_name'] . ' ' . $data['last_name'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => Str::lower($data['email']),
                'username' => Str::lower($data['username']),
                'password' => Hash::make($temporaryPassword),
                'role' => $data['role'],
                'phone' => $data['phone'] ?? null,
                'status' => 'active',
                'preferred_language' => 'en',
                'must_change_password' => true,
                'created_by' => Auth::id(),
            ]);

            StaffProfile::query()->create([
                'user_id' => $user->id,
                'salary' => $data['salary'] ?? 0,
                'hire_date' => $data['hire_date'] ?? now()->toDateString(),
                'address' => $data['address'] ?? null,
            ]);

            if ($data['role'] === 'doctor') {

                DoctorProfile::query()->create([
                    'user_id' => $user->id,
                    'specialization' => $data['specialization'] ?? 'General Medicine',
                ]);
            }

            if ($data['role'] === 'lab_technician') {

                LabTechnicianProfile::query()->create([
                    'user_id' => $user->id,
                    'department' => $data['department'] ?? 'Laboratory',
                ]);
            }

            CredentialExport::query()->create([
                'user_id' => $user->id,
                'generated_by' => Auth::id(),
                'export_type' => 'staff',
                'exported_at' => now(),
            ]);

            $this->audit(
                'created_staff',
                'users',
                $user->id,
                "Created {$user->role} account"
            );

            return $user;
        });

        return response(
            $this->credentialText($user, $temporaryPassword),
            200,
            [
                'Content-Type' => 'text/plain',
                'Content-Disposition' => 'attachment; filename="staff-credentials.txt"',
            ]
        );
    }

    /**
     * Show the staff edit page.
     */
    public function edit(User $staff): Response
    {
        return Inertia::render('admin/staff/edit', [
            'title' => 'Edit Staff Account',
            'record' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'username' => $staff->username,
                'role' => $staff->role,
                'status' => $staff->status,
                'phone' => $staff->phone,
            ],
            'actions' => [
                'update' => route('admin.staff.update', $staff),
            ],
        ]);
    }

    /**
     * Update simple staff status/profile fields.
     */
    public function update(Request $request, User $staff)
    {
        $data = $request->validate([
            'phone' => ['nullable', 'string', 'max:191'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $staff->fill($data);
        $staff->save();

        return response()->json([
            'message' => 'Staff account updated successfully.',
        ]);
    }

    /**
     * Toggle the status of a staff account.
     */
    public function toggleStatus(Request $request, User $staff)
    {
        $staff->status = $staff->status === 'active'
            ? 'inactive'
            : 'active';

        $staff->save();

        return response()->json([
            'status' => $staff->status,
        ]);
    }

    /**
     * Delete a staff account.
     */
    public function destroy(Request $request, User $staff)
    {
        User::destroy($staff->id);

        return response()->json([
            'message' => 'Staff account deleted successfully.',
        ]);
    }

    /**
     * Build the credential TXT file.
     */
    private function credentialText(User $user, string $temporaryPassword): string
    {
        return "Clinic System Credentials\n\n"
            . "Full Name: {$user->name}\n"
            . "Role: {$user->role}\n"
            . "Email: {$user->email}\n"
            . "Username: {$user->username}\n"
            . "Temporary Password: {$temporaryPassword}\n\n"
            . "Please change your password after first login.";
    }
}