<?php

namespace App\Domain\Billing;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'code',
        'name',
        'period_months',
        'price_cents',
        'is_active',
    ];
}
