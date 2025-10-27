<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'part_uid',
        'category_id',
        'title',
        'barcode',
        'manufacturer_country',
        'origin_country',
        'registrant_company_id',
        'current_owner_type',
        'current_owner_company_id',
        'current_owner_elevator_id',
        'extra',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'category_id' => 'integer',
        'registrant_company_id' => 'integer',
        'current_owner_company_id' => 'integer',
        'current_owner_elevator_id' => 'integer',
        'extra' => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Category, self>
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\PartFeatureValue>
     */
    public function featureValues()
    {
        return $this->hasMany(PartFeatureValue::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\PartTransfer>
     */
    public function transfers()
    {
        return $this->hasMany(PartTransfer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<\App\Models\Elevator>
     */
    public function elevators()
    {
        return $this->belongsToMany(Elevator::class, 'elevator_part')
            ->withPivot(['id', 'installer_company_id', 'installed_at', 'removed_at'])
            ->withTimestamps();
    }
}
