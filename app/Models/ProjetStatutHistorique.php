<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjetStatutHistorique extends Model
{
    protected $table = 'projet_statut_historiques';

    protected $fillable = ['projet_id', 'ancien_statut', 'nouveau_statut', 'user_id', 'commentaire'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
