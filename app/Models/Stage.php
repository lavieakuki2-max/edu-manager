<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['projet_id', 'entreprise_id', 'date_debut', 'date_fin', 'objectifs_stage', 'note_finale', 'statut'];

    protected $appends = ['duree_jours', 'jours_ecoules', 'progression', 'statut_calcule'];

    public function projet()
    {
        return $this->belongsTo(ProjetAcademique::class, 'projet_id');
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function journalEntries()
    {
        return $this->hasMany(JournalStage::class, 'stage_id')->orderBy('semaine_numero');
    }

    public function getDureeJoursAttribute(): int
    {
        if (!$this->date_debut || !$this->date_fin) return 0;
        return Carbon::parse($this->date_debut)->diffInDays(Carbon::parse($this->date_fin)) + 1;
    }

    public function getJoursEcoulesAttribute(): int
    {
        if (!$this->date_debut) return 0;
        $debut = Carbon::parse($this->date_debut);
        $now = Carbon::now()->startOfDay();
        if ($now < $debut) return 0;
        $fin = $this->date_fin ? Carbon::parse($this->date_fin) : $now;
        if ($now > $fin) return $this->duree_jours;
        return $debut->diffInDays($now) + 1;
    }

    public function getProgressionAttribute(): float
    {
        $duree = $this->duree_jours;
        if ($duree <= 0) return 0;
        return min(100, round(($this->jours_ecoules / $duree) * 100, 1));
    }

    public function getStatutCalculeAttribute(): string
    {
        if (!$this->date_debut) return 'en_attente';
        $now = Carbon::now()->startOfDay();
        $debut = Carbon::parse($this->date_debut);
        $fin = $this->date_fin ? Carbon::parse($this->date_fin) : null;

        if ($now < $debut) return 'en_attente';
        if ($fin && $now > $fin) return 'termine';
        return 'en_cours';
    }
}
