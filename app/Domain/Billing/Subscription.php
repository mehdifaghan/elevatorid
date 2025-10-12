<?php

namespace App\Domain\Billing;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'tenant_id',
        'plan_id',
        'started_at',
        'expires_at',
        'status',
        'auto_renew',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'auto_renew' => 'bool',
    ];
}
