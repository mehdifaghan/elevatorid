<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'payer_profile_id',
        'amount',
        'currency',
        'description',
        'gateway',
        'ref_num',
        'status',
        'meta',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'integer',
        'meta' => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Profile, self>
     */
    public function payerProfile()
    {
        return $this->belongsTo(Profile::class, 'payer_profile_id');
    }
}
