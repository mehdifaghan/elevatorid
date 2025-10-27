<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpCode extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'phone',
        'code_hash',
        'attempts_remaining',
        'expires_at',
        'last_attempt_at',
        'last_sent_at',
        'sms_log_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'last_attempt_at' => 'datetime',
        'last_sent_at' => 'datetime',
    ];

    public function smsLog(): BelongsTo
    {
        return $this->belongsTo(SmsLog::class);
    }
}

