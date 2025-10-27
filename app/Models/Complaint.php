<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'profile_id',
        'subject',
        'body',
        'status',
        'admin_notes',
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
}
