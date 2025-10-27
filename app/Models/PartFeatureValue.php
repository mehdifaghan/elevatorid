<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartFeatureValue extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'part_id',
        'feature_id',
        'value',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Part, self>
     */
    public function part()
    {
        return $this->belongsTo(Part::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Feature, self>
     */
    public function feature()
    {
        return $this->belongsTo(Feature::class);
    }
}
