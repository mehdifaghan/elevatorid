<?php

namespace App\Domain\Telemetry;

use Illuminate\Database\Eloquent\Model;

class TelemetryLocation extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'task_id',
        'lat',
        'lng',
        'accuracy',
    ];
}
