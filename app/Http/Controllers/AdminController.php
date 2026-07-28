<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AssignEnseignantRequest;
use App\Http\Requests\Admin\PlanifierSoutenanceRequest;
use App\Models\ProjetAcademique;
use App\Models\Soutenance;
use App\Services\NotificationService;
use App\Services\WorkflowService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function assigner(AssignEnseignantRequest $request, ProjetAcademique $projet): RedirectResponse
    {
        $validated = $request->validated();

        $projet->update(['enseignant_id' => $validated['enseignant_id']]);

        $workflow = app(WorkflowService::class);
        if ($workflow->canTransition($projet, 'En Cours', $request->user())) {
            $workflow->transition($projet, 'En Cours', 'Encadreur assigné');
        }

        NotificationService::notifierAttributionEnseignant($projet);

        return back()->with('success', 'Encadreur assigné.');
    }

    public function planifierSoutenance(PlanifierSoutenanceRequest $request, ProjetAcademique $projet): RedirectResponse
    {
        $validated = $request->validated();

        Soutenance::updateOrCreate(['projet_id' => $projet->id], $validated);

        $workflow = app(WorkflowService::class);
        if ($workflow->canTransition($projet, 'Prêt pour Soutenance', $request->user())) {
            $workflow->transition($projet, 'Prêt pour Soutenance', 'Soutenance planifiée');
        }

        return back()->with('success', 'Soutenance planifiée.');
    }

    public function lettreStage(ProjetAcademique $projet)
    {
        $this->authorize('assign', ProjetAcademique::class);

        $projet->load('etudiant.user', 'stage.entreprise', 'enseignant.user');

        return Pdf::loadView('pdf.lettre-stage', compact('projet'))
            ->download('lettre-stage-'.$projet->id.'.pdf');
    }

    public function ficheCotation(ProjetAcademique $projet)
    {
        $this->authorize('assign', ProjetAcademique::class);

        $projet->load('etudiant.user', 'enseignant.user', 'soutenance');

        return Pdf::loadView('pdf.fiche-cotation', compact('projet'))
            ->download('fiche-cotation-'.$projet->id.'.pdf');
    }

    public function rapportGlobal(Request $request)
    {
        $this->authorize('assign', ProjetAcademique::class);

        $annee = $request->query('annee', '2025-2026');

        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user', 'soutenance'])
            ->where('annee_academique', $annee)
            ->latest()
            ->get();

        $stats = [
            'total' => $projets->count(),
            'soumis' => $projets->where('statut_actuel', 'Sujet Soumis')->count(),
            'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            'soutenances' => $projets->where('statut_actuel', 'Prêt pour Soutenance')->count(),
            'valides' => $projets->where('statut_actuel', 'Validé')->count(),
            'a_corriger' => $projets->where('statut_actuel', 'À Corriger')->count(),
            'total_stages' => $projets->where('type', 'Stage')->count(),
            'total_memoires' => $projets->where('type', 'Memoire')->count(),
        ];

        return Pdf::loadView('pdf.rapport-global', compact('projets', 'stats', 'annee'))
            ->download('rapport-global-'.$annee.'.pdf');
    }
}
