<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'trade_id',
        'province',
        'city',
        'address',
        'postal_code',
        'ceo_phone',
        'email',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Profile>
     */
    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }
}
