<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'system_settings';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'sms_provider',
        'sms_config',
        'payment_provider',
        'payment_config',
        'system_maintenance',
        'registration_enabled',
        'meta',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'sms_config' => 'array',
        'payment_config' => 'array',
        'system_maintenance' => 'boolean',
        'registration_enabled' => 'boolean',
        'meta' => 'array',
    ];
}
