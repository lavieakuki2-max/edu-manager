<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapitre extends Model
{
    protected $fillable = ['projet_id', 'titre', 'numero', 'statut'];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'chapitre_id');
    }
}
