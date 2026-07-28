<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjetAcademique extends Model
{
    protected $table = 'projets_academiques';

    protected $fillable = ['titre', 'description', 'type', 'annee_academique', 'statut_actuel', 'etudiant_id', 'enseignant_id'];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class);
    }

    public function memoire()
    {
        return $this->hasOne(Memoire::class, 'projet_id');
    }

    public function stage()
    {
        return $this->hasOne(Stage::class, 'projet_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'projet_id');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'projet_id');
    }

    public function soutenance()
    {
        return $this->hasOne(Soutenance::class, 'projet_id');
    }

    public function historique()
    {
        return $this->hasMany(ProjetStatutHistorique::class, 'projet_id')->latest();
    }
}
