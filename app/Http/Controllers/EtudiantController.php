<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use App\Models\JournalStage;
use App\Models\ProjetAcademique;
use App\Models\Soutenance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EtudiantController extends Controller
{
    public function discussions(Request $request)
    {
        $etudiant = $request->user()->etudiant;
        $projets = ProjetAcademique::where('etudiant_id', $etudiant?->id)->pluck('id');

        $commentaires = Commentaire::whereIn('projet_id', $projets)
            ->with(['projet', 'auteur'])
            ->latest()
            ->get();

        $projetsList = ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->with(['enseignant.user'])
            ->get();

        return Inertia::render('Etudiant/Discussions', [
            'commentaires' => $commentaires,
            'projets' => $projetsList,
        ]);
    }

    public function maSoutenance(Request $request)
    {
        $etudiant = $request->user()->etudiant;
        $projet = ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->with(['soutenance.president.user', 'soutenance.rapporteur.user', 'soutenance.membre.user', 'enseignant.user'])
            ->first();

        $soutenance = $projet?->soutenance ?? null;
        $soutenance?->load(['president.user', 'rapporteur.user', 'membre.user']);

        return Inertia::render('Etudiant/MaSoutenance', [
            'projet' => $projet,
            'soutenance' => $soutenance,
        ]);
    }

    public function suiviStage(Request $request)
    {
        $etudiant = $request->user()->etudiant;
        $projet = ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->where('type', 'Stage')
            ->with(['stage.entreprise', 'stage.journalEntries', 'enseignant.user'])
            ->first();

        $stage = $projet?->stage;

        return Inertia::render('Etudiant/SuiviStage', [
            'projet' => $projet,
            'stage' => $stage,
        ]);
    }

    public function journalStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'stage_id' => 'required|exists:stages,id',
            'semaine_numero' => 'required|integer|min:1',
            'activites' => 'required|string|max:5000',
        ]);

        $stage = \App\Models\Stage::findOrFail($validated['stage_id']);

        $etudiant = $request->user()->etudiant;
        $projet = ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->where('type', 'Stage')
            ->whereHas('stage', fn($q) => $q->where('id', $stage->id))
            ->first();

        if (!$projet) {
            return back()->with('error', 'Stage introuvable ou non autorisé.');
        }

        $existing = JournalStage::where('stage_id', $stage->id)
            ->where('semaine_numero', $validated['semaine_numero'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Un rapport pour cette semaine existe déjà.');
        }

        JournalStage::create([
            'stage_id' => $stage->id,
            'semaine_numero' => $validated['semaine_numero'],
            'activites' => $validated['activites'],
            'date_soumission' => now(),
        ]);

        return back()->with('success', 'Rapport hebdomadaire ajouté.');
    }

    public function journalUpdate(Request $request, JournalStage $journal): RedirectResponse
    {
        $validated = $request->validate([
            'activites' => 'required|string|max:5000',
        ]);

        $etudiant = $request->user()->etudiant;
        $projet = ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->where('type', 'Stage')
            ->whereHas('stage', fn($q) => $q->where('id', $journal->stage_id))
            ->first();

        if (!$projet) {
            return back()->with('error', 'Action non autorisée.');
        }

        $journal->update(['activites' => $validated['activites']]);

        return back()->with('success', 'Rapport mis à jour.');
    }

    public function journalDestroy(JournalStage $journal): RedirectResponse
    {
        $etudiant = request()->user()->etudiant;
        $projet = ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->where('type', 'Stage')
            ->whereHas('stage', fn($q) => $q->where('id', $journal->stage_id))
            ->first();

        if (!$projet) {
            return back()->with('error', 'Action non autorisée.');
        }

        $journal->delete();

        return back()->with('success', 'Rapport supprimé.');
    }
}
