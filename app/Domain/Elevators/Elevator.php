<?php

namespace App\Domain\Elevators;

use Illuminate\Database\Eloquent\Model;

class Elevator extends Model
{
    protected $fillable = [
        'tenant_id',
        'building_id',
        'code',
        'brand',
        'capacity',
    ];
}
