<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    protected $fillable = ['projet_id', 'user_id', 'contenu'];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function auteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
