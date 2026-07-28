<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use App\Models\ProjetAcademique;
use App\Models\Soutenance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjetController extends Controller
{
    public function index(Request $request)
    {
        $query = ProjetAcademique::with([
            'etudiant.user',
            'enseignant.user',
            'stage.entreprise',
            'documents',
            'commentaires',
            'soutenance',
        ])->latest();

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('statut') && $request->statut !== 'all') {
            if ($request->statut === 'en_attente_attribution') {
                $query->where('statut_actuel', 'Sujet Soumis')->whereNull('enseignant_id');
            } else {
                $query->where('statut_actuel', $request->statut);
            }
        }

        if ($request->filled('filiere') && $request->filiere !== 'all') {
            $query->whereHas('etudiant', fn ($q) => $q->where('filiere', $request->filiere));
        }

        if ($request->filled('annee') && $request->annee !== 'all') {
            $query->where('annee_academique', $request->annee);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('etudiant.user', function ($uq) use ($search) {
                      $uq->where('nom', 'like', "%{$search}%")
                         ->orWhere('prenom', 'like', "%{$search}%");
                  })
                  ->orWhereHas('etudiant', fn ($eq) => $eq->where('matricule', 'like', "%{$search}%"));
            });
        }

        $projets = $query->get();

        $totalProjets = $projets->count();
        $stats = [
            'total' => $totalProjets,
            'en_attente' => $projets->where('statut_actuel', 'Sujet Soumis')->where('enseignant_id', null)->count(),
            'soumis' => $projets->where('statut_actuel', 'Sujet Soumis')->where('enseignant_id', '!=', null)->count(),
            'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            'a_corriger' => $projets->where('statut_actuel', 'À Corriger')->count(),
            'prets' => $projets->where('statut_actuel', 'Prêt pour Soutenance')->count(),
            'valides' => $projets->where('statut_actuel', 'Validé')->count(),
            'stages' => $projets->where('type', 'Stage')->count(),
            'memoires' => $projets->where('type', 'Memoire')->count(),
            'projets_tutores' => $projets->where('type', 'Projet_Tutore')->count(),
            'taux_reussite' => $totalProjets > 0 ? round(($projets->where('statut_actuel', 'Validé')->count() / $totalProjets) * 100, 1) : 0,
        ];

        $enseignants = Enseignant::with('user')
            ->withCount(['projets_encadres as charge_actuelle' => function ($q) {
                $q->whereNotIn('statut_actuel', ['Validé']);
            }])
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'nom_complet' => $e->user?->prenom . ' ' . $e->user?->nom,
                'grade' => $e->grade,
                'specialite' => $e->specialite,
                'charge_actuelle' => $e->charge_actuelle,
            ]);

        $filieres = ProjetAcademique::whereHas('etudiant')
            ->with('etudiant')
            ->get()
            ->pluck('etudiant.filiere')
            ->unique()
            ->filter()
            ->values();

        $annees = ProjetAcademique::select('annee_academique')
            ->distinct()
            ->orderBy('annee_academique', 'desc')
            ->pluck('annee_academique');

        return Inertia::render('Admin/Projets', [
            'projets' => $projets,
            'stats' => $stats,
            'enseignants' => $enseignants,
            'filieres' => $filieres,
            'annees' => $annees,
            'filters' => $request->only(['type', 'statut', 'filiere', 'annee', 'search']),
        ]);
    }
}
