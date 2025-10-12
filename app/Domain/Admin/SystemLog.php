<?php

namespace App\Domain\Admin;

use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{
    protected $fillable = [
        'level',
        'message',
        'tenant_id',
        'user_id',
        'context',
    ];

    protected $casts = [
        'context' => 'array',
    ];
}
