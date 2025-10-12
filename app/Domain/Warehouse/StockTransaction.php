<?php

namespace App\Domain\Warehouse;

use Illuminate\Database\Eloquent\Model;

class StockTransaction extends Model
{
    protected $fillable = [
        'tenant_id',
        'item_id',
        'delta',
        'reason',
        'task_id',
        'created_by',
    ];
}
