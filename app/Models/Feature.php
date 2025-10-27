<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'key',
        'data_type',
        'enum_values',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'enum_values' => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Category, self>
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
