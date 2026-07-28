<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Soutenance extends Model
{
    protected $fillable = [
        'projet_id', 'date_soutenance', 'heure_debut', 'heure_fin', 'salle',
        'president_id', 'rapporteur_id', 'membre_id',
        'note_finale', 'mention', 'remarques', 'statut',
    ];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function president()
    {
        return $this->belongsTo(Enseignant::class, 'president_id');
    }

    public function rapporteur()
    {
        return $this->belongsTo(Enseignant::class, 'rapporteur_id');
    }

    public function membre()
    {
        return $this->belongsTo(Enseignant::class, 'membre_id');
    }

    public static function calculerMention(?float $note): ?string
    {
        if ($note === null) return null;
        return match (true) {
            $note >= 16 => 'Très Bien',
            $note >= 14 => 'Bien',
            $note >= 12 => 'Assez Bien',
            $note >= 10 => 'Passable',
            default => 'Insuffisant',
        };
    }
}
