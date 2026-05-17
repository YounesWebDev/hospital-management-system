<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Inertia\Inertia;

abstract class Controller
{
    /**
     * Store a lightweight audit entry for important user actions.
     *
     * Controllers call this after the database change succeeds so the log
     * points to a real record and does not contain passwords or private data.
     */
    protected function audit(string $action, ?string $tableName = null, ?int $recordId = null, ?string $description = null): void
    {
        AuditLog::query()->create([
            'user_id' => $this->currentUserId(),
            'action' => $action,
            'table_name' => $tableName,
            'record_id' => $recordId,
            'description' => $description,
        ]);
    }

    /**
     * Return the current authenticated user's id in a way static analysis understands.
     */
    protected function currentUserId(): ?int
    {
        return auth()->user()?->getAuthIdentifier();
    }
}
