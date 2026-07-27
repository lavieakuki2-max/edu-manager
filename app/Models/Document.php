<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = ['projet_id', 'user_id', 'titre_fichier', 'chemin_stockage', 'version', 'date_depot'];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function auteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
