<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StaffProfile extends Model
{
    protected $fillable = [
        'user_id',
        'salary',
        'hire_date',
        'address',
    ];

    /**
     * User account for this staff profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Payments recorded by this accountant.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'accountant_id');
    }
}
