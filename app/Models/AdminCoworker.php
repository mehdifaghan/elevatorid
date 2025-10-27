<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminCoworker extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'org_name',
        'phone',
        'access_mgmt_reports',
        'access_parts_inquiry',
        'access_elevators_inquiry',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'access_mgmt_reports' => 'boolean',
        'access_parts_inquiry' => 'boolean',
        'access_elevators_inquiry' => 'boolean',
    ];
}
