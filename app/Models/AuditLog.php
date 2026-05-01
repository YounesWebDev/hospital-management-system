<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'table_name',
        'record_id',
        'description',
    ];

    /**
     * User who performed the logged action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
