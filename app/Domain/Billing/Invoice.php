<?php

namespace App\Domain\Billing;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'tenant_id',
        'building_id',
        'total_cents',
        'status',
    ];
}
