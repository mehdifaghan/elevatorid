<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'notifications',
        'privacy',
        'display',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'notifications' => 'array',
        'privacy' => 'array',
        'display' => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\User, self>
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
