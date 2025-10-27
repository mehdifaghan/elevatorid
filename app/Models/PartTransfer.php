<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartTransfer extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'part_id',
        'seller_company_id',
        'buyer_company_id',
        'approved_by_ceo_phone',
        'approved_at',
        'status',
        'reject_reason',
        'direction',
        'other_company_name',
        'reason',
        'notes',
        'transfer_date',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'approved_at' => 'datetime',
        'transfer_date' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Part, self>
     */
    public function part()
    {
        return $this->belongsTo(Part::class);
    }
}
