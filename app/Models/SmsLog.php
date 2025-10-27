<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SmsLog extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_SENT = 'sent';
    public const STATUS_FAILED = 'failed';
    public const STATUS_SKIPPED = 'skipped';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'phone',
        'ip_address',
        'purpose',
        'provider',
        'status',
        'message',
        'message_hash',
        'provider_message_id',
        'error_code',
        'error_message',
        'meta',
        'requested_at',
        'sent_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'meta' => 'array',
        'requested_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function otpCode(): HasOne
    {
        return $this->hasOne(OtpCode::class);
    }
}
