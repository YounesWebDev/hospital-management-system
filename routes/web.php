<?php

use App\Http\Controllers\Accountant\BillingController as AccountantBillingController;
use App\Http\Controllers\Accountant\PaymentController as AccountantPaymentController;
use App\Http\Controllers\Accountant\ReceiptController as AccountantReceiptController;
use App\Http\Controllers\Admin\PatientController as AdminPatientController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Doctor\AnalysisRequestController as DoctorAnalysisRequestController;
use App\Http\Controllers\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Doctor\BillingController as DoctorBillingController;
use App\Http\Controllers\Doctor\MedicalNoteController;
use App\Http\Controllers\Doctor\PatientFileController;
use App\Http\Controllers\Doctor\PrescriptionController;
use App\Http\Controllers\Lab\AnalysisRequestController as LabAnalysisRequestController;
use App\Http\Controllers\Lab\AnalysisResultController;
use App\Http\Controllers\NotificationOpenController;
use App\Http\Controllers\Patient\PatientDashboardController;
use App\Http\Controllers\Patient\PatientMedicalFileController;
use App\Http\Controllers\Receptionist\AppointmentController as ReceptionistAppointmentController;
use App\Http\Controllers\Receptionist\NotificationController;
use App\Http\Controllers\Receptionist\PatientController as ReceptionistPatientController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// Public landing page for the hospital management system.
Route::inertia('/', 'public/home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    // Generic dashboard route kept for starter links.
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('notifications/{notification}/open', NotificationOpenController::class)->name('notifications.open');

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function (): void {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('staff', [StaffController::class, 'index'])->name('staff.index');
        Route::get('staff/create', [StaffController::class, 'create'])->name('staff.create');
        Route::post('staff', [StaffController::class, 'store'])->name('staff.store');
        Route::get('staff/{staff}/edit', [StaffController::class, 'edit'])->name('staff.edit');
        Route::patch('staff/{staff}', [StaffController::class, 'update'])->name('staff.update');
        Route::get('patients', [AdminPatientController::class, 'index'])->name('patients.index');
        Route::get('appointments', [ReportController::class, 'appointments'])->name('appointments.index');
        Route::get('analyses', [ReportController::class, 'analyses'])->name('analyses.index');
        Route::get('billing', [ReportController::class, 'billing'])->name('billing.index');
        Route::get('payments', [ReportController::class, 'payments'])->name('payments.index');
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [SettingController::class, 'store'])->name('settings.store');
    });

    Route::middleware('role:receptionist')->prefix('receptionist')->name('receptionist.')->group(function (): void {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('patients', [ReceptionistPatientController::class, 'index'])->name('patients.index');
        Route::get('patients/create', [ReceptionistPatientController::class, 'create'])->name('patients.create');
        Route::post('patients', [ReceptionistPatientController::class, 'store'])->name('patients.store');
        Route::get('patients/{patient}', [ReceptionistPatientController::class, 'show'])->name('patients.show');
        Route::get('appointments', [ReceptionistAppointmentController::class, 'index'])->name('appointments.index');
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications', [NotificationController::class, 'store'])->name('notifications.store');
    });

    Route::middleware('role:doctor')->prefix('doctor')->name('doctor.')->group(function (): void {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('patients/search', [PatientFileController::class, 'search'])->name('patients.search');
        Route::get('patients/{patient}', [PatientFileController::class, 'show'])->name('patients.show');
        Route::post('medical-notes', [MedicalNoteController::class, 'store'])->name('medical-notes.store');
        Route::get('prescriptions/create', [PrescriptionController::class, 'create'])->name('prescriptions.create');
        Route::post('prescriptions', [PrescriptionController::class, 'store'])->name('prescriptions.store');
        Route::get('analysis-requests/create', [DoctorAnalysisRequestController::class, 'create'])->name('analysis-requests.create');
        Route::post('analysis-requests', [DoctorAnalysisRequestController::class, 'store'])->name('analysis-requests.store');
        Route::get('appointments/create', [DoctorAppointmentController::class, 'create'])->name('appointments.create');
        Route::post('appointments', [DoctorAppointmentController::class, 'store'])->name('appointments.store');
        Route::get('billing/create', [DoctorBillingController::class, 'create'])->name('billing.create');
        Route::post('billing', [DoctorBillingController::class, 'store'])->name('billing.store');
    });

    Route::middleware('role:lab_technician')->prefix('lab')->name('lab.')->group(function (): void {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('analysis-requests', [LabAnalysisRequestController::class, 'index'])->name('analysis-requests.index');
        Route::get('analysis-requests/{analysisRequest}', [LabAnalysisRequestController::class, 'show'])->name('analysis-requests.show');
        Route::post('analysis-requests/{analysisRequest}/progress', [LabAnalysisRequestController::class, 'progress'])->name('analysis-requests.progress');
        Route::get('analysis-requests/{analysisRequest}/results/create', [AnalysisResultController::class, 'create'])->name('analysis-results.create');
        Route::post('analysis-requests/{analysisRequest}/results', [AnalysisResultController::class, 'store'])->name('analysis-results.store');
    });

    Route::middleware('role:accountant')->prefix('accountant')->name('accountant.')->group(function (): void {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('patients/search', [AccountantBillingController::class, 'search'])->name('patients.search');
        Route::get('billing/{billing}', [AccountantBillingController::class, 'show'])->name('billing.show');
        Route::get('billing/{billing}/payments/create', [AccountantPaymentController::class, 'create'])->name('payments.create');
        Route::post('billing/{billing}/payments', [AccountantPaymentController::class, 'store'])->name('payments.store');
        Route::get('receipts/{payment}', [AccountantReceiptController::class, 'show'])->name('receipts.show');
    });

    Route::middleware('role:patient')->prefix('patient')->name('patient.')->group(function (): void {
        Route::get('dashboard', PatientDashboardController::class)->name('dashboard');
        Route::get('profile', [PatientMedicalFileController::class, 'profile'])->name('profile');
        Route::get('appointments', [PatientMedicalFileController::class, 'appointments'])->name('appointments.index');
        Route::get('prescriptions', [PatientMedicalFileController::class, 'prescriptions'])->name('prescriptions.index');
        Route::get('analyses', [PatientMedicalFileController::class, 'analyses'])->name('analyses.index');
        Route::get('billing', [PatientMedicalFileController::class, 'billing'])->name('billing.index');
        Route::get('payments', [PatientMedicalFileController::class, 'payments'])->name('payments.index');
        Route::get('notifications', [PatientMedicalFileController::class, 'notifications'])->name('notifications.index');
        Route::post('notifications/{notification}/read', [PatientMedicalFileController::class, 'markNotificationRead'])->name('notifications.read');
    });
});

require __DIR__.'/settings.php';
