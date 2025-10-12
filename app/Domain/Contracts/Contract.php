<?php

namespace App\Domain\Contracts;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = [
        'tenant_id',
        'building_id',
        'title',
        'start_date',
        'end_date',
        'price_cents',
    ];
}
