<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use App\Models\LabTechnicianProfile;
use Illuminate\Http\Request;

class AnalysisResultController extends Controller
{
    /**
     * Show result upload form.
     */
    public function create(AnalysisRequest $analysisRequest)
    {
        // Return the selected request so the upload page knows what result is being created.
        return response()->json(['analysisRequest' => $analysisRequest]);
    }

    /**
     * Store text/file path result and complete the request.
     */
    public function store(Request $request, AnalysisRequest $analysisRequest)
    {
        // Validate the optional text result and optional uploaded file.
        $data = $request->validate([
            'result_text' => ['nullable', 'string'],
            'result_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ]);

        // Store uploaded PDF/image results on the public disk.
        $filePath = $request->hasFile('result_file')
            ? $request->file('result_file')->store('analysis-results', 'public')
            : null;

        // Find the lab technician profile linked to the logged-in user.
        $labTechnicianId = LabTechnicianProfile::query()->where('user_id', auth()->id())->value('id');

        // Save the result under the original analysis request.
        $result = $analysisRequest->result()->create([
            'patient_id' => $analysisRequest->patient_id,
            'doctor_id' => $analysisRequest->doctor_id,
            'lab_technician_id' => $labTechnicianId,
            'result_text' => $data['result_text'] ?? null,
            'file_path' => $filePath,
            'uploaded_at' => now(),
        ]);

        // Mark the request as completed once its result is stored.
        $analysisRequest->update([
            'status' => 'completed',
        ]);

        return response()->json(['result' => $result]);
    }
}
