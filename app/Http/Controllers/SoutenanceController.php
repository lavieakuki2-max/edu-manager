<?php

namespace App\Http\Controllers;

use App\Models\Soutenance;
use App\Models\ProjetAcademique;
use App\Models\Enseignant;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SoutenanceController extends Controller
{
    public function index()
    {
        $soutenances = Soutenance::with([
            'projet.etudiant.user',
            'projet.enseignant.user',
            'president.user',
            'rapporteur.user',
            'membre.user',
        ])->orderBy('date_soutenance', 'desc')->get();

        $projetsPret = ProjetAcademique::where('statut_actuel', 'Prêt pour Soutenance')
            ->with(['etudiant.user', 'enseignant.user'])
            ->get();

        $enseignants = Enseignant::with('user')->get();

        return Inertia::render('Admin/Soutenances', [
            'soutenances' => $soutenances,
            'projetsPret' => $projetsPret,
            'enseignants' => $enseignants,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'projet_id' => 'required|exists:projets_academiques,id',
                'date_soutenance' => 'required|date',
                'heure_debut' => 'nullable|date_format:H:i',
                'heure_fin' => 'nullable|date_format:H:i',
                'salle' => 'required|string',
                'president_id' => 'nullable|exists:enseignants,id',
                'rapporteur_id' => 'nullable|exists:enseignants,id',
                'membre_id' => 'nullable|exists:enseignants,id',
            ]);

            $validated['statut'] = 'planifiee';

            $soutenance = Soutenance::create($validated);

            $soutenance->load(['projet.etudiant.user', 'projet.enseignant.user', 'president.user', 'rapporteur.user', 'membre.user']);

            NotificationService::notifierPlanificationSoutenance($soutenance);

            return back()->with('success', 'Soutenance planifiée avec succès.');
        } catch (\Exception $e) {
            Log::error('Erreur planification soutenance: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de la planification de la soutenance.');
        }
    }

    public function update(Request $request, Soutenance $soutenance)
    {
        try {
            $validated = $request->validate([
                'date_soutenance' => 'nullable|date',
                'heure_debut' => 'nullable|date_format:H:i',
                'heure_fin' => 'nullable|date_format:H:i',
                'salle' => 'nullable|string',
                'president_id' => 'nullable|exists:enseignants,id',
                'rapporteur_id' => 'nullable|exists:enseignants,id',
                'membre_id' => 'nullable|exists:enseignants,id',
                'note_finale' => 'nullable|numeric|min:0|max:20',
                'mention' => 'nullable|string',
                'remarques' => 'nullable|string',
                'statut' => 'nullable|string|in:planifiee,realisee,annulee',
            ]);

            if (isset($validated['note_finale']) && $validated['note_finale'] !== null) {
                if (!isset($validated['mention']) || !$validated['mention']) {
                    $validated['mention'] = Soutenance::calculerMention((float) $validated['note_finale']);
                }
                if ($soutenance->projet) {
                    $soutenance->projet->update(['statut_actuel' => 'Validé']);
                }
            }

            $soutenance->update($validated);

            if (isset($validated['note_finale']) && $validated['note_finale'] !== null) {
                $soutenance->load(['projet.etudiant.user', 'projet.enseignant.user']);
                NotificationService::notifierResultatSoutenance($soutenance);
            }

            return back()->with('success', 'Soutenance mise à jour.');
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour soutenance: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de la mise à jour de la soutenance.');
        }
    }

    public function destroy(Soutenance $soutenance)
    {
        try {
            $soutenance->delete();
            return back()->with('success', 'Soutenance supprimée.');
        } catch (\Exception $e) {
            Log::error('Erreur suppression soutenance: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de la suppression de la soutenance.');
        }
    }

    public function evaluation(Request $request, Soutenance $soutenance)
    {
        try {
            $enseignant = $request->user()->enseignant;

            $isJury = in_array($enseignant?->id, [
                $soutenance->president_id,
                $soutenance->rapporteur_id,
                $soutenance->membre_id,
            ], true);

            if (!$isJury) {
                return back()->with('error', 'Vous n\'êtes pas membre du jury pour cette soutenance.');
            }

            $validated = $request->validate([
                'note_finale' => 'nullable|numeric|min:0|max:20',
                'remarques' => 'nullable|string',
            ]);

            if (isset($validated['note_finale']) && $validated['note_finale'] !== null) {
                $soutenance->update([
                    'note_finale' => $validated['note_finale'],
                    'mention' => Soutenance::calculerMention((float) $validated['note_finale']),
                    'remarques' => $validated['remarques'] ?? $soutenance->remarques,
                    'statut' => 'realisee',
                ]);
                if ($soutenance->projet) {
                    $soutenance->projet->update(['statut_actuel' => 'Validé']);
                }
                $soutenance->load(['projet.etudiant.user', 'projet.enseignant.user']);
                NotificationService::notifierResultatSoutenance($soutenance);
            } else {
                $soutenance->update(['remarques' => $validated['remarques'] ?? $soutenance->remarques]);
            }

            return back()->with('success', 'Évaluation enregistrée.');
        } catch (\Exception $e) {
            Log::error('Erreur évaluation soutenance: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de l\'enregistrement de l\'évaluation.');
        }
    }
}
