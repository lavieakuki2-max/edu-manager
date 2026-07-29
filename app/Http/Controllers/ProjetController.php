<?php

namespace App\Http\Controllers;

use App\Http\Requests\Projets\StoreProjetRequest;
use App\Http\Requests\Projets\UpdateStatutRequest;
use App\Models\Enseignant;
use App\Models\Entreprise;
use App\Models\ProjetAcademique;
use App\Services\NotificationService;
use App\Services\WorkflowService;
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

    public function show(ProjetAcademique $projet)
    {
        $this->authorize('view', $projet);

        $user = request()->user();
        $workflow = app(WorkflowService::class);

        $projet->load([
            'etudiant.user',
            'enseignant.user',
            'memoire',
            'stage.entreprise',
            'documents.auteur',
            'commentaires.auteur',
            'soutenance',
            'historique.user',
        ]);

        return Inertia::render('Projets/Show', [
            'projet' => $projet,
            'canAdmin' => $user->role === 'admin',
            'canComment' => $user->role === 'admin' || $user->role === 'enseignant'
                ? $projet->enseignant_id === $user->enseignant?->id
                : $projet->etudiant_id === $user->etudiant?->id,
            'canUpload' => $user->role === 'etudiant' || $user->role === 'enseignant',
            'isSupervision' => $user->role === 'admin',
            'availableTransitions' => $workflow->getAvailableTransitions($projet, $user),
            'workflowStatuses' => WorkflowService::STATUSES,
        ]);
    }

    public function store(StoreProjetRequest $request): RedirectResponse
    {
        $validated = $request->validated();

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
        } else        if ($validated['type'] === 'Stage') {
            $entrepriseId = $validated['entreprise_id'] ?? null;

            if (!$entrepriseId && !empty($validated['nouvelle_entreprise'])) {
                $nouvelle = Entreprise::create([
                    'raison_sociale' => $validated['nouvelle_entreprise'],
                    'adresse' => $validated['nouvelle_entreprise_adresse'] ?? null,
                    'telephone' => $validated['nouvelle_entreprise_telephone'] ?? null,
                    'email' => $validated['nouvelle_entreprise_email'] ?? null,
                    'maitre_stage' => $validated['nouvelle_entreprise_maitre_stage'] ?? null,
                    'maitre_stage_telephone' => $validated['nouvelle_entreprise_maitre_stage_telephone'] ?? null,
                    'maitre_stage_email' => $validated['nouvelle_entreprise_maitre_stage_email'] ?? null,
                ]);
                $entrepriseId = $nouvelle->id;
            }

            $projet->stage()->create([
                'entreprise_id' => $entrepriseId,
                'date_debut' => $validated['date_debut'],
                'date_fin' => $validated['date_fin'],
                'objectifs_stage' => $validated['objectifs_stage'],
            ]);
        }

        NotificationService::notifierSoumissionSujet($projet);

        return back()->with('success', 'Sujet soumis avec succès.');
    }

    public function updateStatut(UpdateStatutRequest $request, ProjetAcademique $projet): RedirectResponse
    {
        $validated = $request->validated();

        $workflow = app(WorkflowService::class);
        $workflow->transition($projet, $validated['statut_actuel'], $validated['commentaire'] ?? null);

        return back()->with('success', 'Statut mis à jour.');
    }
}
