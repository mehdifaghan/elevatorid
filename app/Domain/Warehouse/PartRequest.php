<?php

namespace App\Domain\Warehouse;

use Illuminate\Database\Eloquent\Model;

class PartRequest extends Model
{
    protected $fillable = [
        'tenant_id',
        'task_id',
        'user_id',
        'part_name',
        'qty',
        'note',
        'status',
    ];
}
