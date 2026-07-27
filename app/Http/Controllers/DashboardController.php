<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\ProjetAcademique;
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

        return Inertia::render('Dashboard', [
            'role' => $user->role,
            'stats' => [
                'projets' => $projets->count(),
                'valides' => $projets->where('statut_actuel', 'Validé')->count(),
                'soutenances' => $projets->where('statut_actuel', 'Prêt pour Soutenance')->count(),
                'documents' => Document::whereIn('projet_id', $projets->pluck('id'))->count(),
                'utilisateurs' => $user->role === 'admin' ? User::count() : null,
            ],
            'projets' => $projets->take(5)->values(),
            'documentsRecents' => Document::with('projet', 'auteur')
                ->whereIn('projet_id', $projets->pluck('id'))
                ->latest('date_depot')
                ->take(5)
                ->get(),
        ]);
    }
}
