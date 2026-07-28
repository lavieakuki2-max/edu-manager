<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use App\Models\Document;
use App\Models\ProjetAcademique;
use App\Models\ProjetStatutHistorique;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = ProjetAcademique::query();

        if ($user->role === 'etudiant') {
            $query->where('etudiant_id', $user->etudiant?->id);
        }

        if ($user->role === 'enseignant') {
            $query->where('enseignant_id', $user->enseignant?->id);
        }

        $projets = $query->with('etudiant.user', 'enseignant.user')->latest()->get();

        $stats = [
            'projets' => $projets->count(),
            'valides' => $projets->where('statut_actuel', 'Validé')->count(),
            'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            'soutenances' => $projets->where('statut_actuel', 'Prêt pour Soutenance')->count(),
            'a_corriger' => $projets->where('statut_actuel', 'À Corriger')->count(),
            'soumis' => $projets->where('statut_actuel', 'Sujet Soumis')->count(),
            'documents' => Document::whereIn('projet_id', $projets->pluck('id'))->count(),
            'commentaires' => Commentaire::whereIn('projet_id', $projets->pluck('id'))->count(),
            'utilisateurs' => $user->role === 'admin' ? User::count() : null,
        ];

        $documentsRecents = Document::with('projet', 'auteur')
            ->whereIn('projet_id', $projets->pluck('id'))
            ->latest('date_depot')
            ->take(5)
            ->get();

        $recentActivity = ProjetStatutHistorique::with('projet', 'user')
            ->whereIn('projet_id', $projets->pluck('id'))
            ->latest()
            ->take(8)
            ->get();

        $alertes = collect();
        if ($user->role === 'admin') {
            $alertes = $projets->filter(fn ($p) => $p->statut_actuel === 'Sujet Soumis' && !$p->enseignant_id)
                ->take(5)
                ->values();
        }

        if ($user->role === 'enseignant') {
            $alertes = $projets->filter(fn ($p) => in_array($p->statut_actuel, ['À Corriger', 'Sujet Soumis']))
                ->take(5)
                ->values();
        }

        return Inertia::render('Dashboard', [
            'role' => $user->role,
            'userName' => $user->prenom . ' ' . $user->nom,
            'stats' => $stats,
            'projets' => $projets->take(5)->values(),
            'documentsRecents' => $documentsRecents,
            'recentActivity' => $recentActivity,
            'alertes' => $alertes,
        ]);
    }
}