<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Elevator extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'elevator_uid',
        'municipality_zone',
        'build_permit_no',
        'registry_plate',
        'province',
        'city',
        'address',
        'postal_code',
        'installer_company_id',
        'status',
        'last_inspection_at',
        'next_inspection_due_at',
        'meta',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'installer_company_id' => 'integer',
        'last_inspection_at' => 'datetime',
        'next_inspection_due_at' => 'datetime',
        'meta' => 'array',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<\App\Models\Part>
     */
    public function parts()
    {
        return $this->belongsToMany(Part::class, 'elevator_part')
            ->withPivot(['id', 'installer_company_id', 'installed_at', 'removed_at'])
            ->withTimestamps();
    }
}
