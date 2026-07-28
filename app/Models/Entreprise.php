<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    protected $fillable = [
        'raison_sociale', 'adresse', 'telephone', 'email',
        'secteur', 'maitre_stage', 'maitre_stage_telephone', 'maitre_stage_email',
    ];

    public function stages()
    {
        return $this->hasMany(Stage::class);
    }

    public function projets()
    {
        return $this->hasManyThrough(ProjetAcademique::class, Stage::class, 'entreprise_id', 'id', 'id', 'projet_id');
    }
}
