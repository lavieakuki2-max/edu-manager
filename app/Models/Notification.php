<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['user_id', 'titre', 'message', 'lien_url', 'est_lu'];

    protected $casts = [
        'est_lu' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeNonLues($query)
    {
        return $query->where('est_lu', false);
    }
}
