<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    protected $fillable = ['raison_sociale', 'adresse', 'telephone', 'maitre_stage'];

    public function stages()
    {
        return $this->hasMany(Stage::class);
    }
}
