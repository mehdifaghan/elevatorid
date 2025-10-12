<?php

namespace App\Domain\Tasks;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'tenant_id',
        'building_id',
        'elevator_id',
        'title',
        'status',
        'assigned_to_id',
    ];
}
