<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileDocument extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'profile_id',
        'doc_type',
        'file_path',
        'original_name',
        'mime_type',
        'size',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Profile, self>
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
