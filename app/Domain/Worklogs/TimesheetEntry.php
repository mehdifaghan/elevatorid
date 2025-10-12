<?php

namespace App\Domain\Worklogs;

use Illuminate\Database\Eloquent\Model;

class TimesheetEntry extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'started_at',
        'ended_at',
        'task_id',
        'note',
    ];

    protected $dates = ['started_at', 'ended_at'];
}
