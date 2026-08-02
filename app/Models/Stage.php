<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = ['projet_id', 'entreprise_id', 'date_debut', 'date_fin', 'duree_jours', 'objectifs_stage', 'note_finale', 'statut', 'statut_validation'];

    protected $appends = ['duree_jours', 'jours_ecoules', 'progression', 'statut_calcule', 'statut_courant'];

    protected static function booted(): void
    {
        static::saving(function (self $stage) {
            if ($stage->date_debut && $stage->date_fin) {
                $stage->duree_jours = Carbon::parse($stage->date_debut)
                    ->diffInDays(Carbon::parse($stage->date_fin)) + 1;
            }
        });
    }

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
        if ($this->attributes['duree_jours'] ?? false) {
            return (int) $this->attributes['duree_jours'];
        }
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
        if (!$this->date_debut) return 'Approuvé (En attente de démarrage)';
        $now = Carbon::now()->startOfDay();
        $debut = Carbon::parse($this->date_debut);
        $fin = $this->date_fin ? Carbon::parse($this->date_fin) : null;

        if ($now < $debut) return 'Approuvé (En attente de démarrage)';
        if ($fin && $now > $fin) return 'Stage Achevé';
        return 'En Stage (Actif)';
    }

    public function getStatutCourantAttribute(): string
    {
        if (!$this->date_debut || !$this->date_fin || $this->statut_validation !== 'valide') {
            return 'En attente d\'approbation';
        }
        $now = Carbon::now()->startOfDay();
        $debut = Carbon::parse($this->date_debut);
        $fin = Carbon::parse($this->date_fin);

        if ($now < $debut) return 'Approuvé (En attente de démarrage)';
        if ($now > $fin) return 'Stage Achevé';
        return 'En Stage (Actif)';
    }
}
