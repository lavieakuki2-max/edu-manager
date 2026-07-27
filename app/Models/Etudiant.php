<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    protected $fillable = ['user_id', 'matricule', 'classe', 'filiere'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projets()
    {
        return $this->hasMany(ProjetAcademique::class);
    }
}
