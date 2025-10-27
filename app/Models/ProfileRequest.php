<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileRequest extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'profile_id',
        'type',
        'current_profile_type',
        'requested_profile_type',
        'status',
        'reviewer_user_id',
        'reject_reason',
        'note',
        'meta',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'profile_id' => 'integer',
        'meta' => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Profile, self>
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\User, self>
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_user_id');
    }
}
