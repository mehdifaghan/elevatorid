<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElevatorMaintenanceLog extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'elevator_id',
        'user_id',
        'type',
        'description',
        'cost',
        'performed_by',
        'performed_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'cost' => 'decimal:2',
        'performed_at' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Elevator, self>
     */
    public function elevator()
    {
        return $this->belongsTo(Elevator::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\User, self>
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
