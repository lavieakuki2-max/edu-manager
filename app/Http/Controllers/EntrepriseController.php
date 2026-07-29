<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntrepriseController extends Controller
{
    public function index(Request $request)
    {
        $query = Entreprise::with(['stages.projet.etudiant.user']);

        $search = $request->input('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('raison_sociale', 'like', "%{$search}%")
                  ->orWhere('secteur', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('maitre_stage', 'like', "%{$search}%")
                  ->orWhere('adresse', 'like', "%{$search}%");
            });
        }

        $entreprises = $query->orderBy('raison_sociale')->get()->map(function ($e) {
            $stagesActifs = $e->stages->filter(fn($s) => $s->projet && $s->projet->statut_actuel !== 'Validé');
            return [
                'id' => $e->id,
                'raison_sociale' => $e->raison_sociale,
                'adresse' => $e->adresse,
                'telephone' => $e->telephone,
                'email' => $e->email,
                'secteur' => $e->secteur,
                'maitre_stage' => $e->maitre_stage,
                'maitre_stage_telephone' => $e->maitre_stage_telephone,
                'maitre_stage_email' => $e->maitre_stage_email,
                'stagiaires_actifs' => $stagesActifs->count(),
                'stages_count' => $e->stages->count(),
                'stages' => $e->stages->map(fn($s) => [
                    'id' => $s->id,
                    'projet_id' => $s->projet_id,
                    'date_debut' => $s->date_debut,
                    'date_fin' => $s->date_fin,
                    'statut' => $s->projet?->statut_actuel,
                    'etudiant' => $s->projet?->etudiant ? [
                        'id' => $s->projet->etudiant->id,
                        'matricule' => $s->projet->etudiant->matricule,
                        'nom' => $s->projet->etudiant->user?->nom,
                        'prenom' => $s->projet->etudiant->user?->prenom,
                    ] : null,
                    'projet_titre' => $s->projet?->titre,
                ]),
            ];
        });

        $stats = [
            'total' => $entreprises->count(),
            'stagiaires_actifs' => $entreprises->sum('stagiaires_actifs'),
            'total_stages' => $entreprises->sum('stages_count'),
        ];

        if ($request->wantsJson()) {
            return response()->json(['entreprises' => $entreprises]);
        }

        return Inertia::render('Admin/Entreprises', [
            'entreprises' => $entreprises,
            'stats' => $stats,
            'filters' => $request->only('search'),
        ]);
    }

    public function show(Entreprise $entreprise)
    {
        $entreprise->load(['stages.projet.etudiant.user', 'stages.projet.enseignant.user']);

        $stages = $entreprise->stages->map(fn($s) => [
            'id' => $s->id,
            'date_debut' => $s->date_debut,
            'date_fin' => $s->date_fin,
            'objectifs_stage' => $s->objectifs_stage,
            'note_finale' => $s->note_finale,
            'projet' => $s->projet ? [
                'id' => $s->projet->id,
                'titre' => $s->projet->titre,
                'annee_academique' => $s->projet->annee_academique,
                'statut_actuel' => $s->projet->statut_actuel,
            ] : null,
            'etudiant' => $s->projet?->etudiant ? [
                'id' => $s->projet->etudiant->id,
                'matricule' => $s->projet->etudiant->matricule,
                'nom' => $s->projet->etudiant->user?->nom,
                'prenom' => $s->projet->etudiant->user?->prenom,
            ] : null,
            'encadreur' => $s->projet?->enseignant ? [
                'nom' => $s->projet->enseignant->user?->nom,
                'prenom' => $s->projet->enseignant->user?->prenom,
            ] : null,
        ]);

        return Inertia::render('Admin/EntrepriseShow', [
            'entreprise' => [
                'id' => $entreprise->id,
                'raison_sociale' => $entreprise->raison_sociale,
                'adresse' => $entreprise->adresse,
                'telephone' => $entreprise->telephone,
                'email' => $entreprise->email,
                'secteur' => $entreprise->secteur,
                'maitre_stage' => $entreprise->maitre_stage,
                'maitre_stage_telephone' => $entreprise->maitre_stage_telephone,
                'maitre_stage_email' => $entreprise->maitre_stage_email,
            ],
            'stages' => $stages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:255',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'secteur' => 'nullable|string|max:255',
            'maitre_stage' => 'nullable|string|max:255',
            'maitre_stage_telephone' => 'nullable|string|max:50',
            'maitre_stage_email' => 'nullable|email|max:255',
        ]);

        $entreprise = Entreprise::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['entreprise' => $entreprise, 'success' => 'Entreprise ajoutée.']);
        }

        return back()->with('success', 'Entreprise ajoutée avec succès.');
    }

    public function update(Request $request, Entreprise $entreprise)
    {
        $validated = $request->validate([
            'raison_sociale' => 'required|string|max:255',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'secteur' => 'nullable|string|max:255',
            'maitre_stage' => 'nullable|string|max:255',
            'maitre_stage_telephone' => 'nullable|string|max:50',
            'maitre_stage_email' => 'nullable|email|max:255',
        ]);

        $entreprise->update($validated);

        return back()->with('success', 'Entreprise mise à jour avec succès.');
    }

    public function destroy(Entreprise $entreprise)
    {
        $entreprise->delete();
        return back()->with('success', 'Entreprise supprimée.');
    }

    public function export()
    {
        $entreprises = Entreprise::withCount('stages')->orderBy('raison_sociale')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="annuaire-entreprises.csv"',
        ];

        $callback = function () use ($entreprises) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [
                'Raison sociale', 'Adresse', 'Téléphone', 'Email',
                'Secteur', 'Maître de stage', 'Tél. maître de stage',
                'Email maître de stage', 'Stages effectués',
            ], ';');

            foreach ($entreprises as $e) {
                fputcsv($handle, [
                    $e->raison_sociale,
                    $e->adresse ?? '',
                    $e->telephone ?? '',
                    $e->email ?? '',
                    $e->secteur ?? '',
                    $e->maitre_stage ?? '',
                    $e->maitre_stage_telephone ?? '',
                    $e->maitre_stage_email ?? '',
                    $e->stages_count ?? 0,
                ], ';');
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');
        $entreprises = Entreprise::where('raison_sociale', 'like', "%{$query}%")
            ->orWhere('secteur', 'like', "%{$query}%")
            ->orderBy('raison_sociale')
            ->limit(15)
            ->get(['id', 'raison_sociale', 'adresse', 'secteur']);

        return response()->json($entreprises);
    }
}
