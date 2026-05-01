<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CredentialExport extends Model
{
    protected $fillable = [
        'user_id',
        'generated_by',
        'export_type',
        'exported_at',
    ];

    /**
     * Cast export date to a date-time object.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'exported_at' => 'datetime',
        ];
    }

    /**
     * User whose credentials were exported.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Staff user who generated the export.
     */
    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
