<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalStage extends Model
{
    protected $table = 'journal_stages';

    protected $fillable = ['stage_id', 'semaine_numero', 'activites', 'date_soumission'];

    protected $casts = [
        'date_soumission' => 'datetime',
    ];

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }
}
