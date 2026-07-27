<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enseignant extends Model
{
    protected $fillable = ['user_id', 'grade', 'specialite'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projets_encadres()
    {
        return $this->hasMany(ProjetAcademique::class, 'enseignant_id');
    }
}
