<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['projet_id', 'entreprise_id', 'date_debut', 'date_fin', 'objectifs_stage', 'note_finale'];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }
}
