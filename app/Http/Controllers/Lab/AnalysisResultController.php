<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use App\Models\AnalysisResult;
use App\Models\LabTechnicianProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalysisResultController extends Controller
{
    /**
     * Show a list of analysis results.
     */
    public function index()
    {
        $results = \App\Models\AnalysisResult::query()
            ->with(['analysisRequest.patient.user:id,name', 'analysisRequest.doctor.user:id,name'])
            ->latest()
            ->get()
            ->map(fn ($result) => [
                'id' => $result->id,
                'patient' => $result->analysisRequest?->patient?->user?->name,
                'doctor' => $result->analysisRequest?->doctor?->user?->name,
                'type' => $result->analysisRequest?->analysis_type,
                'result' => $result->result_text,
                'created_at' => $result->created_at?->toDateString(),
            ]);

        return Inertia::render('lab/analysis-results/index', [
            'title' => 'Analysis Results',
            'records' => $results,
        ]);
    }

    /**
     * Show result upload form.
     */
    public function create(AnalysisRequest $analysisRequest)
    {
        // Return the selected request so the upload page knows what result is being created.
        return Inertia::render('lab/analysis-results/create', [
            'title' => 'Upload Analysis Result',
            'records' => [$analysisRequest],
            'actions' => [
                'store' => route('lab.analysis-results.store', $analysisRequest),
            ],
        ]);
    }

    /**
     * Show the specified analysis result.
     */
    public function show(AnalysisResult $analysisResult)
    {
        return Inertia::render('lab/analysis-results/show', [
            'result' => $analysisResult->load(['analysisRequest.patient.user', 'analysisRequest.doctor.user', 'labTechnician.user']),
        ]);
    }

    /**
     * Store text/file path result and complete the request.
     */
    public function store(Request $request, AnalysisRequest $analysisRequest)
    {
        // Validate the optional text result and optional uploaded file.
        $data = $request->validate([
            'result_text' => ['nullable', 'string'],
            'result_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:5120'],
        ]);

        // Store uploaded PDF/image results on the public disk.
        $filePath = $request->hasFile('result_file')
            ? $request->file('result_file')->store('analysis-results', 'public')
            : null;

        // Find the lab technician profile linked to the logged-in user.
        $labTechnicianId = LabTechnicianProfile::query()->where('user_id', $request->user()->id)->value('id');

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
