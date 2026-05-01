<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\DoctorProfile;
use App\Models\MedicalNote;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class MedicalNoteController extends Controller
{
    /**
     * Add a note to a patient file.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate the patient id and note text before saving the note.
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patient_profiles,id'],
            'note' => ['required', 'string'],
        ]);

        // Find the doctor profile linked to the logged-in user.
        $doctorId = DoctorProfile::query()->where('user_id', auth()->id())->value('id');

        $note = MedicalNote::query()->create([
            'patient_id' => $data['patient_id'],
            'doctor_id' => $doctorId,
            'note' => $data['note'],
        ]);

        // Record that a new medical note was added.
        $this->audit('added_medical_note', 'medical_notes', $note->id, 'Doctor added note');

        return back();
    }
}
