<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjetAcademique;
use App\Models\Stage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StageSuiviController extends Controller
{
    public function index(Request $request)
    {
        $query = Stage::with([
            'projet.etudiant.user',
            'projet.enseignant.user',
            'entreprise',
            'journalEntries',
        ]);

        $filters = $request->only(['statut', 'search', 'filiere']);

        if (!empty($filters['statut'])) {
            if ($filters['statut'] === 'en_attente') {
                $query->whereDate('date_debut', '>', now());
            } elseif ($filters['statut'] === 'en_cours') {
                $query->whereDate('date_debut', '<=', now())
                    ->whereDate('date_fin', '>=', now());
            } elseif ($filters['statut'] === 'termine') {
                $query->whereDate('date_fin', '<', now());
            }
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('projet.etudiant.user', function ($q2) use ($search) {
                    $q2->where('nom', 'like', "%{$search}%")
                       ->orWhere('prenom', 'like', "%{$search}%");
                })->orWhereHas('entreprise', function ($q2) use ($search) {
                    $q2->where('raison_sociale', 'like', "%{$search}%");
                });
            });
        }

        if (!empty($filters['filiere'])) {
            $query->whereHas('projet.etudiant', function ($q) use ($filters) {
                $q->where('filiere', $filters['filiere']);
            });
        }

        $stages = $query->orderBy('date_debut', 'desc')->get();

        $stats = [
            'total' => Stage::count(),
            'en_attente' => Stage::whereDate('date_debut', '>', now())->count(),
            'en_cours' => Stage::whereDate('date_debut', '<=', now())
                ->whereDate('date_fin', '>=', now())->count(),
            'termine' => Stage::whereDate('date_fin', '<', now())->count(),
        ];

        $filieres = \App\Models\Etudiant::distinct('filiere')
            ->whereNotNull('filiere')
            ->pluck('filiere')
            ->map(fn($f) => ['value' => $f, 'label' => $f]);

        return Inertia::render('Admin/Stages', [
            'stages' => $stages,
            'stats' => $stats,
            'filieres' => $filieres,
            'filters' => $filters,
        ]);
    }

    public function show(Stage $stage)
    {
        $stage->load([
            'projet.etudiant.user',
            'projet.enseignant.user',
            'projet.documents.auteur',
            'entreprise',
            'journalEntries' => fn($q) => $q->orderBy('semaine_numero'),
        ]);

        return Inertia::render('Admin/Stages/Detail', [
            'stage' => $stage,
        ]);
    }

    public function updateStatut(Request $request, Stage $stage)
    {
        $validated = $request->validate([
            'statut' => 'required|in:en_attente,en_cours,termine',
        ]);

        $stage->update(['statut' => $validated['statut']]);

        return back()->with('success', 'Statut du stage mis à jour.');
    }
}
