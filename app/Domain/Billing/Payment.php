<?php

namespace App\Domain\Billing;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'tenant_id',
        'invoice_id',
        'amount_cents',
        'method',
        'reference',
    ];
}
