<?php

namespace App\Http\Controllers;

use App\Models\Soutenance;
use App\Models\ProjetAcademique;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SoutenanceController extends Controller
{
    public function index()
    {
        $soutenances = Soutenance::with(['projet.etudiant.user', 'projet.enseignant.user'])
            ->orderBy('date_soutenance', 'desc')
            ->get();

        $projetsPret = ProjetAcademique::where('statut_actuel', 'Prêt pour Soutenance')
            ->with(['etudiant.user', 'enseignant.user'])
            ->get();

        return Inertia::render('Admin/Soutenances', [
            'soutenances' => $soutenances,
            'projetsPret' => $projetsPret,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'projet_id' => 'required|exists:projets_academiques,id',
            'date_soutenance' => 'required|date',
            'salle' => 'required|string',
            'jury' => 'nullable|array',
        ]);

        Soutenance::create($validated);

        return back()->with('success', 'Soutenance planifiée.');
    }

    public function update(Request $request, Soutenance $soutenance)
    {
        $validated = $request->validate([
            'date_soutenance' => 'nullable|date',
            'salle' => 'nullable|string',
            'note_finale' => 'nullable|numeric|min:0|max:20',
        ]);

        $soutenance->update($validated);

        if (isset($validated['note_finale']) && $validated['note_finale'] !== null) {
            $soutenance->projet->update(['statut_actuel' => 'Validé']);
        }

        return back()->with('success', 'Soutenance mise à jour.');
    }

    public function destroy(Soutenance $soutenance)
    {
        $soutenance->delete();
        return back()->with('success', 'Soutenance supprimée.');
    }
}
