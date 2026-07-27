<?php

namespace App\Http\Controllers;

use App\Models\ProjetAcademique;
use App\Models\Soutenance;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function assigner(Request $request, ProjetAcademique $projet): RedirectResponse
    {
        $this->authorize('assign', ProjetAcademique::class);

        $validated = $request->validate([
            'enseignant_id' => ['required', 'exists:enseignants,id'],
        ]);

        $projet->update($validated + ['statut_actuel' => 'En Cours']);

        return back()->with('success', 'Encadreur assigné.');
    }

    public function planifierSoutenance(Request $request, ProjetAcademique $projet): RedirectResponse
    {
        $this->authorize('assign', ProjetAcademique::class);

        $validated = $request->validate([
            'date_soutenance' => ['required', 'date'],
            'salle' => ['required', 'string', 'max:255'],
            'note_finale' => ['nullable', 'numeric', 'between:0,20'],
        ]);

        Soutenance::updateOrCreate(['projet_id' => $projet->id], $validated);
        $projet->update(['statut_actuel' => 'Prêt pour Soutenance']);

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
}
