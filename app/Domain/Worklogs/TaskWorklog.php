<?php

namespace App\Domain\Worklogs;

use Illuminate\Database\Eloquent\Model;

class TaskWorklog extends Model
{
    protected $fillable = [
        'tenant_id',
        'task_id',
        'user_id',
        'description',
        'duration_min',
    ];
}
