<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntrepriseController extends Controller
{
    public function index()
    {
        $entreprises = Entreprise::withCount(['projets' => function ($q) {
            $q->where('type', 'Stage')->where('statut_actuel', '!=', 'Validé');
        }])->with('projets.etudiant.user')->get();

        return Inertia::render('Admin/Entreprises', [
            'entreprises' => $entreprises,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:255',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string',
            'email_contact' => 'nullable|email',
            'maitre_stage' => 'nullable|string',
        ]);

        Entreprise::create($validated);

        return back()->with('success', 'Entreprise ajoutée.');
    }

    public function update(Request $request, Entreprise $entreprise)
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:255',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string',
            'email_contact' => 'nullable|email',
            'maitre_stage' => 'nullable|string',
        ]);

        $entreprise->update($validated);

        return back()->with('success', 'Entreprise mise à jour.');
    }

    public function destroy(Entreprise $entreprise)
    {
        $entreprise->delete();
        return back()->with('success', 'Entreprise supprimée.');
    }
}
