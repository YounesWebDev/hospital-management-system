<?php

namespace App\Http\Controllers\Lab;

use App\Http\Controllers\Controller;
use App\Models\AnalysisRequest;
use Inertia\Inertia;

class AnalysisRequestController extends Controller
{
    /**
     * Show lab analysis requests.
     */
    public function index()
    {
        // Load request rows with the patient and doctor names shown on the lab dashboard.
        $requests = AnalysisRequest::query()
            ->with(['patient.user:id,name', 'doctor.user:id,name'])
            ->latest()
            ->get()
            // Convert each request into a simple row for the analysis request table.
            ->map(fn (AnalysisRequest $request): array => [
                'id' => $request->id,
                'patient' => $request->patient?->user?->name,
                'doctor' => $request->doctor?->user?->name,
                'analysis_type' => $request->analysis_type,
                'status' => $request->status,
            ]);

        return Inertia::render('lab/analysis-requests/index', [
            'title' => 'Analysis Requests',
            'records' => $requests,
        ]);
    }

    /**
     * Show one analysis request.
     */
    public function show(AnalysisRequest $analysisRequest)
    {
        // Load the two related users needed to show this request clearly to the lab team.
        $analysisRequest->load(['patient.user:id,name', 'doctor.user:id,name']);

return Inertia::render('lab/analysis-requests/show', [
            'title' => 'Analysis Request Details',
            'records' => [[
                'id' => $analysisRequest->id,
                'patient' => $analysisRequest->patient?->user?->name,
                'doctor' => $analysisRequest->doctor?->user?->name,
                'analysis_type' => $analysisRequest->analysis_type,
                'description' => $analysisRequest->description,
                'status' => $analysisRequest->status,
            ]],
            'actions' => [
                'result' => route('lab.analysis-results.create', $analysisRequest),
                'progress' => route('lab.analysis-requests.progress', $analysisRequest),
            ],
        ]);
    }

    /**
     * Mark a request as in progress.
     */
    public function progress(AnalysisRequest $analysisRequest)
    {
        // Mark the request as being worked on and store when the lab started it.
        $analysisRequest->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->redirectTo(route('lab.analysis-requests.show', $analysisRequest));
    }
}
