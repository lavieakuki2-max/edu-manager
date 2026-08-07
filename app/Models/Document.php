<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = ['projet_id', 'user_id', 'titre_fichier', 'chemin_stockage', 'version', 'date_depot', 'chapitre_id'];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function chapitre()
    {
        return $this->belongsTo(Chapitre::class, 'chapitre_id');
    }

    public function auteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'document_id');
    }
}
