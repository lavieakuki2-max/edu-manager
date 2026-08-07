<?php

namespace App\Http\Controllers;

use App\Http\Requests\Chapitres\StoreChapitreRequest;
use App\Http\Requests\Chapitres\UpdateChapitreStatutRequest;
use App\Models\Chapitre;
use App\Models\ProjetAcademique;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChapitreController extends Controller
{
    public function store(StoreChapitreRequest $request, ProjetAcademique $projet): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $numero = ((int) $projet->chapitres()->max('numero')) + 1;

            $projet->chapitres()->create([
                'titre' => $validated['titre'],
                'numero' => $numero,
                'statut' => 'En Attente',
            ]);

            return back()->with('success', 'Chapitre ajouté.');
        } catch (\Exception $e) {
            Log::error('Erreur ajout chapitre: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de l\'ajout du chapitre.');
        }
    }

    public function updateStatut(UpdateChapitreStatutRequest $request, Chapitre $chapitre): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $chapitre->update(['statut' => $validated['statut']]);

            NotificationService::notifierChapitreStatut($chapitre->refresh(), $request->user());

            return back()->with('success', 'Statut du chapitre mis à jour.');
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour chapitre: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de la mise à jour du chapitre.');
        }
    }

    public function destroy(Request $request, Chapitre $chapitre): RedirectResponse
    {
        try {
            if ($request->user()->role !== 'admin'
                && !($request->user()->role === 'enseignant' && $chapitre->projet->enseignant_id === $request->user()->enseignant?->id)) {
                abort(403, 'Action non autorisée.');
            }

            $chapitre->delete();

            return back()->with('success', 'Chapitre supprimé.');
        } catch (\Exception $e) {
            Log::error('Erreur suppression chapitre: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de la suppression du chapitre.');
        }
    }
}
