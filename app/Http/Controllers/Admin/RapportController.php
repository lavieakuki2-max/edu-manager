<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Enseignant;
use App\Models\Entreprise;
use App\Models\ProjetAcademique;
use App\Models\Soutenance;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RapportController extends Controller
{
    public function index(Request $request)
    {
        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user', 'documents', 'soutenance'])
            ->latest()
            ->get();

        $documents = Document::with(['projet', 'auteur'])
            ->latest('date_depot')
            ->get();

        $totalEns = Enseignant::count();
        $totalEtudiants = User::where('role', 'etudiant')->count();

        $stats = [
            'total_projets' => $projets->count(),
            'stages' => $projets->where('type', 'Stage')->count(),
            'memoires' => $projets->where('type', 'Memoire')->count(),
            'valides' => $projets->where('statut_actuel', 'Validé')->count(),
            'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            'soumis' => $projets->where('statut_actuel', 'Sujet Soumis')->count(),
            'soutenances_planifiees' => Soutenance::count(),
            'soutenances_effectuees' => Soutenance::whereNotNull('note_finale')->count(),
            'a_corriger' => $projets->where('statut_actuel', 'À Corriger')->count(),
            'total_documents' => $documents->count(),
            'total_users' => User::count(),
            'moyenne_etudiants_par_enseignant' => $totalEns > 0 ? round($totalEtudiants / $totalEns, 1) : 0,
            'taux_reussite' => $projets->count() > 0 ? round(($projets->where('statut_actuel', 'Validé')->count() / $projets->count()) * 100, 1) : 0,
        ];

        return Inertia::render('Admin/Rapports', [
            'projets' => $projets,
            'documents' => $documents->take(20),
            'stats' => $stats,
        ]);
    }

    public function rapportStatistique(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user', 'soutenance'])->latest()->get();

        $stats = [
            'total' => $projets->count(),
            'stages' => $projets->where('type', 'Stage')->count(),
            'memoires' => $projets->where('type', 'Memoire')->count(),
            'valides' => $projets->where('statut_actuel', 'Validé')->count(),
            'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            'soumis' => $projets->where('statut_actuel', 'Sujet Soumis')->count(),
            'a_corriger' => $projets->where('statut_actuel', 'À Corriger')->count(),
            'taux_reussite' => $projets->count() > 0 ? round(($projets->where('statut_actuel', 'Validé')->count() / $projets->count()) * 100, 1) : 0,
        ];

        $pdf = Pdf::loadView('pdf.rapport-statistique', compact('projets', 'stats', 'annee'))
            ->setPaper('a4', 'portrait');
        $pdf->getDompdf()->setOption('isHtml5ParserEnabled', true);

        return $pdf->download("rapport-statistique-{$annee}.pdf");
    }

    public function listeEtudiantsValides(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user'])
            ->where('statut_actuel', 'Validé')
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.liste-etudiants-valides', compact('projets', 'annee'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("liste-etudiants-valides-{$annee}.pdf");
    }

    public function lettresRecommandation(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'entreprise'])
            ->where('type', 'Stage')
            ->where('statut_actuel', 'Validé')
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.lettres-recommandation', compact('projets', 'annee'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("lettres-recommandation-{$annee}.pdf");
    }

    public function grilleCotation(Request $request, ProjetAcademique $projet)
    {
        $projet->load(['etudiant.user', 'enseignant.user', 'soutenance', 'entreprise']);
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);

        $pdf = Pdf::loadView('pdf.grille-cotation', compact('projet', 'annee'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("grille-cotation-{$projet->etudiant?->matricule}.pdf");
    }

    public function repartitionEnseignants(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $enseignants = Enseignant::with(['user', 'projets_encadres.etudiant.user'])->get();

        $pdf = Pdf::loadView('pdf.repartition-enseignants', compact('enseignants', 'annee'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("repartition-enseignants-{$annee}.pdf");
    }

    public function annuaireEntreprises(Request $request)
    {
        $entreprises = Entreprise::withCount('projets')->get();
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);

        $pdf = Pdf::loadView('pdf.annuaire-entreprises', compact('entreprises', 'annee'))
            ->setPaper('a4', 'portrait');

        return $pdf->download("annuaire-entreprises-{$annee}.pdf");
    }
}
