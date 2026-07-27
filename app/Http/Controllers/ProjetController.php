<?php

namespace App\Http\Controllers;

use App\Models\Enseignant;
use App\Models\Entreprise;
use App\Models\ProjetAcademique;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjetController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = ProjetAcademique::with([
            'etudiant.user',
            'enseignant.user',
            'memoire',
            'stage.entreprise',
            'documents.auteur',
            'commentaires.auteur',
            'soutenance',
        ])->latest();

        if ($user->role === 'etudiant') {
            $query->where('etudiant_id', $user->etudiant?->id);
        }

        if ($user->role === 'enseignant') {
            $query->where('enseignant_id', $user->enseignant?->id);
        }

        return Inertia::render('Projets/Index', [
            'projets' => $query->get(),
            'enseignants' => Enseignant::with('user')->get(),
            'entreprises' => Entreprise::orderBy('raison_sociale')->get(),
            'canCreate' => $user->role === 'etudiant',
            'canAdmin' => $user->role === 'admin',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('submit', ProjetAcademique::class);

        $validated = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'in:Stage,Memoire'],
            'annee_academique' => ['required', 'string', 'max:20'],
            'theme_recherche' => ['nullable', 'required_if:type,Memoire', 'string', 'max:255'],
            'mots_cles' => ['nullable', 'string', 'max:255'],
            'entreprise_id' => ['nullable', 'required_if:type,Stage', 'exists:entreprises,id'],
            'date_debut' => ['nullable', 'required_if:type,Stage', 'date'],
            'date_fin' => ['nullable', 'required_if:type,Stage', 'date', 'after_or_equal:date_debut'],
            'objectifs_stage' => ['nullable', 'required_if:type,Stage', 'string'],
        ]);

        $projet = ProjetAcademique::create([
            'titre' => $validated['titre'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'annee_academique' => $validated['annee_academique'],
            'statut_actuel' => 'Sujet Soumis',
            'etudiant_id' => $request->user()->etudiant->id,
        ]);

        if ($validated['type'] === 'Memoire') {
            $projet->memoire()->create([
                'theme_recherche' => $validated['theme_recherche'],
                'mots_cles' => $validated['mots_cles'] ?? null,
            ]);
        } else {
            $projet->stage()->create([
                'entreprise_id' => $validated['entreprise_id'],
                'date_debut' => $validated['date_debut'],
                'date_fin' => $validated['date_fin'],
                'objectifs_stage' => $validated['objectifs_stage'],
            ]);
        }

        return back()->with('success', 'Sujet soumis avec succès.');
    }

    public function updateStatut(Request $request, ProjetAcademique $projet): RedirectResponse
    {
        $this->authorize('update', $projet);

        $validated = $request->validate([
            'statut_actuel' => ['required', 'in:Sujet Soumis,En Cours,Prêt pour Soutenance,Validé'],
        ]);

        $projet->update($validated);

        return back()->with('success', 'Statut mis à jour.');
    }
}
