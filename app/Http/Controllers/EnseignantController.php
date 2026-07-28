<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use App\Models\ProjetAcademique;
use App\Models\ProjetStatutHistorique;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnseignantController extends Controller
{
    public function mesEtudiants(Request $request)
    {
        $enseignant = $request->user()->enseignant;
        $projets = ProjetAcademique::where('enseignant_id', $enseignant?->id)
            ->with(['etudiant.user', 'etudiant.projets'])
            ->get();

        $etudiants = $projets->pluck('etudiant')->filter()->unique('id')->values();

        return Inertia::render('Enseignant/MesEtudiants', [
            'etudiants' => $etudiants->map(fn($e) => [
                'id' => $e->id,
                'matricule' => $e->matricule,
                'classe' => $e->classe,
                'filiere' => $e->filiere,
                'user' => $e->user,
                'projets_count' => $e->projets->where('enseignant_id', $enseignant?->id)->count(),
                'projets' => $e->projets->where('enseignant_id', $enseignant?->id)->map(fn($p) => [
                    'id' => $p->id,
                    'titre' => $p->titre,
                    'type' => $p->type,
                    'statut_actuel' => $p->statut_actuel,
                ]),
            ]),
            'stats' => [
                'total_etudiants' => $etudiants->count(),
                'total_projets' => $projets->count(),
                'valides' => $projets->where('statut_actuel', 'Validé')->count(),
                'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            ],
        ]);
    }

    public function commentaires(Request $request)
    {
        $enseignant = $request->user()->enseignant;
        $projets = ProjetAcademique::where('enseignant_id', $enseignant?->id)->pluck('id');

        $commentaires = Commentaire::whereIn('projet_id', $projets)
            ->with(['projet', 'auteur', 'projet.etudiant.user'])
            ->latest()
            ->get();

        return Inertia::render('Enseignant/Commentaires', [
            'commentaires' => $commentaires,
        ]);
    }

    public function soutenances(Request $request)
    {
        $enseignant = $request->user()->enseignant;
        $projets = ProjetAcademique::where('enseignant_id', $enseignant?->id)->pluck('id');

        $soutenances = \App\Models\Soutenance::whereIn('projet_id', $projets)
            ->orWhere('president_id', $enseignant?->id)
            ->orWhere('rapporteur_id', $enseignant?->id)
            ->orWhere('membre_id', $enseignant?->id)
            ->with([
                'projet.etudiant.user',
                'projet.enseignant.user',
                'president.user',
                'rapporteur.user',
                'membre.user',
            ])
            ->orderBy('date_soutenance', 'desc')
            ->get();

        $role = $request->user()->role;

        return Inertia::render('Enseignant/Soutenances', [
            'soutenances' => $soutenances,
            'monRole' => $role,
            'enseignantId' => $enseignant?->id,
        ]);
    }

    public function documents(Request $request)
    {
        $enseignant = $request->user()->enseignant;
        $projets = ProjetAcademique::where('enseignant_id', $enseignant?->id)->pluck('id');

        $documents = Document::whereIn('projet_id', $projets)
            ->with(['projet.etudiant.user', 'auteur'])
            ->latest('date_depot')
            ->get();

        return Inertia::render('Enseignant/Documents', [
            'documents' => $documents,
        ]);
    }
}
