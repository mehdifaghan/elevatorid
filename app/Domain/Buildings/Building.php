<?php

namespace App\Domain\Buildings;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'address',
        'lat',
        'lng',
    ];
}
