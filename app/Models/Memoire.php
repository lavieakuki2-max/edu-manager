<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Memoire extends Model
{
    protected $fillable = ['projet_id', 'theme_recherche', 'mots_cles'];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }
}
