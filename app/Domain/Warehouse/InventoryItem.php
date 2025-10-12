<?php

namespace App\Domain\Warehouse;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = [
        'tenant_id',
        'code',
        'name',
        'brand',
        'unit',
        'stock',
    ];
}
