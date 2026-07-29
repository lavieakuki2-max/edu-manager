<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Enseignant;
use App\Models\Entreprise;
use App\Models\ProjetAcademique;
use App\Models\Soutenance;
use App\Models\User;
use App\Services\DocumentExportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RapportController extends Controller
{
    public function index(Request $request)
    {
        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user', 'documents', 'soutenance', 'stage.entreprise'])
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
            'projets_tutores' => $projets->where('type', 'Projet_Tutore')->count(),
            'valides' => $projets->where('statut_actuel', 'Validé')->count(),
            'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            'soumis' => $projets->where('statut_actuel', 'Sujet Soumis')->count(),
            'soutenances_planifiees' => Soutenance::count(),
            'soutenances_effectuees' => Soutenance::whereNotNull('note_finale')->count(),
            'a_corriger' => $projets->where('statut_actuel', 'À Corriger')->count(),
            'total_documents' => $documents->count(),
            'total_users' => User::count(),
            'total_enseignants' => $totalEns,
            'total_entreprises' => Entreprise::count(),
            'moyenne_etudiants_par_enseignant' => $totalEns > 0 ? round($totalEtudiants / $totalEns, 1) : 0,
            'taux_reussite' => $projets->count() > 0 ? round(($projets->where('statut_actuel', 'Validé')->count() / $projets->count()) * 100, 1) : 0,
        ];

        return Inertia::render('Admin/Rapports', [
            'projets' => $projets,
            'documents' => $documents->take(20),
            'stats' => $stats,
        ]);
    }

    // ─── PDF GENERATION ───────────────────────────────────────────

    public function rapportStatistique(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user', 'soutenance'])->latest()->get();

        $stats = $this->computeStats($projets);

        $pdf = Pdf::loadView('pdf.rapport-statistique', compact('projets', 'stats', 'annee'))
            ->setPaper('a4', 'portrait');

        return $this->servePdf($pdf, "rapport-statistique-{$annee}", $request);
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

        return $this->servePdf($pdf, "liste-etudiants-valides-{$annee}", $request);
    }

    public function lettresRecommandation(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'stage.entreprise'])
            ->where('type', 'Stage')
            ->where('statut_actuel', 'Validé')
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.lettres-recommandation', compact('projets', 'annee'))
            ->setPaper('a4', 'portrait');

        return $this->servePdf($pdf, "lettres-recommandation-{$annee}", $request);
    }

    public function grilleCotation(Request $request, ProjetAcademique $projet)
    {
        $projet->load(['etudiant.user', 'enseignant.user', 'soutenance', 'stage.entreprise']);
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);

        $pdf = Pdf::loadView('pdf.grille-cotation', compact('projet', 'annee'))
            ->setPaper('a4', 'portrait');

        $matricule = $projet->etudiant?->matricule ?? $projet->id;
        $filename = "grille-cotation-{$matricule}";
        return $this->servePdf($pdf, $filename, $request);
    }

    public function repartitionEnseignants(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $enseignants = Enseignant::with(['user', 'projets_encadres.etudiant.user'])->get();

        $pdf = Pdf::loadView('pdf.repartition-enseignants', compact('enseignants', 'annee'))
            ->setPaper('a4', 'portrait');

        return $this->servePdf($pdf, "repartition-enseignants-{$annee}", $request);
    }

    public function annuaireEntreprises(Request $request)
    {
        $entreprises = Entreprise::withCount('stages')->get();
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);

        $pdf = Pdf::loadView('pdf.annuaire-entreprises', compact('entreprises', 'annee'))
            ->setPaper('a4', 'portrait');

        return $this->servePdf($pdf, "annuaire-entreprises-{$annee}", $request);
    }

    public function attestationValidation(Request $request, ProjetAcademique $projet)
    {
        $projet->load(['etudiant.user', 'enseignant.user', 'stage.entreprise', 'soutenance']);
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);

        $pdf = Pdf::loadView('pdf.attestation-validation', compact('projet', 'annee'))
            ->setPaper('a4', 'portrait');

        $matricule = $projet->etudiant?->matricule ?? $projet->id;
        $filename = "attestation-{$matricule}";
        return $this->servePdf($pdf, $filename, $request);
    }

    public function pvSoutenance(Request $request, ProjetAcademique $projet)
    {
        $projet->load(['etudiant.user', 'enseignant.user', 'soutenance.president.user', 'soutenance.rapporteur.user', 'soutenance.membre.user', 'stage.entreprise']);
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);

        $pdf = Pdf::loadView('pdf.pv-soutenance', compact('projet', 'annee'))
            ->setPaper('a4', 'portrait');

        $matricule = $projet->etudiant?->matricule ?? $projet->id;
        $filename = "pv-soutenance-{$matricule}";
        return $this->servePdf($pdf, $filename, $request);
    }

    // ─── WORD GENERATION ──────────────────────────────────────────

    public function rapportStatistiqueWord(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user'])->latest()->get();
        $stats = $this->computeStats($projets);

        $headers = ['#', 'Titre', 'Type', 'Étudiant', 'Encadreur', 'Statut'];
        $rows = $projets->map(fn($p, $i) => [
            $i + 1,
            e($p->titre),
            e($p->type),
            e($p->etudiant?->user?->prenom ?? '') . ' ' . e($p->etudiant?->user?->nom ?? ''),
            e($p->enseignant?->user?->prenom ?? '') . ' ' . e($p->enseignant?->user?->nom ?? ''),
            e($p->statut_actuel),
        ])->toArray();

        $html = '<p><strong>Total projets : ' . $stats['total'] . '</strong> | Stages: ' . $stats['stages'] . ' | Mémoires: ' . $stats['memoires'] . ' | Taux réussite: ' . $stats['taux_reussite'] . '%</p>';
        $html .= DocumentExportService::renderHtmlTable($headers, $rows);

        return DocumentExportService::generateWord(
            'Rapport Statistique Global — ' . $annee,
            $html,
            "rapport-statistique-{$annee}"
        );
    }

    public function listeEtudiantsValidesWord(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'enseignant.user'])
            ->where('statut_actuel', 'Validé')->latest()->get();

        $headers = ['#', 'Matricule', 'Nom & Prénom', 'Titre', 'Type', 'Encadreur'];
        $rows = $projets->map(fn($p, $i) => [
            $i + 1,
            e($p->etudiant?->matricule ?? '—'),
            e($p->etudiant?->user?->prenom ?? '') . ' ' . e($p->etudiant?->user?->nom ?? ''),
            e($p->titre),
            e($p->type),
            e($p->enseignant?->user?->prenom ?? '') . ' ' . e($p->enseignant?->user?->nom ?? ''),
        ])->toArray();

        $html = '<p>Total : <strong>' . $projets->count() . '</strong> projet(s) validé(s)</p>';
        $html .= DocumentExportService::renderHtmlTable($headers, $rows);

        return DocumentExportService::generateWord(
            'Liste des Étudiants et Sujets Validés — ' . $annee,
            $html,
            "liste-etudiants-valides-{$annee}"
        );
    }

    public function repartitionEnseignantsWord(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $enseignants = Enseignant::with(['user', 'projets_encadres.etudiant.user'])->get();

        $html = '';
        foreach ($enseignants as $e) {
            $nom = e($e->user?->prenom ?? '') . ' ' . e($e->user?->nom ?? '');
            $grade = $e->grade ? ' (' . e($e->grade) . ')' : '';
            $html .= '<h4>' . $nom . $grade . ' — ' . $e->projets_encadres->count() . ' projet(s)</h4>';

            if ($e->projets_encadres->count() > 0) {
                $headers = ['#', 'Étudiant', 'Matricule', 'Titre', 'Type', 'Statut'];
                $rows = $e->projets_encadres->map(fn($p, $j) => [
                    $j + 1,
                    e($p->etudiant?->user?->prenom ?? '') . ' ' . e($p->etudiant?->user?->nom ?? ''),
                    e($p->etudiant?->matricule ?? '—'),
                    e($p->titre),
                    e($p->type),
                    e($p->statut_actuel),
                ])->toArray();
                $html .= DocumentExportService::renderHtmlTable($headers, $rows);
            } else {
                $html .= '<p style="color:#999;">Aucun projet encadré.</p>';
            }
        }

        return DocumentExportService::generateWord(
            'Répartition des Projets par Enseignant — ' . $annee,
            $html,
            "repartition-enseignants-{$annee}"
        );
    }

    public function annuaireEntreprisesWord(Request $request)
    {
        $entreprises = Entreprise::withCount('stages')->get();
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);

        $headers = ['#', 'Raison sociale', 'Secteur', 'Adresse', 'Téléphone', 'Email', 'Maître de stage', 'Stages'];
        $rows = $entreprises->map(fn($e, $i) => [
            $i + 1,
            e($e->raison_sociale),
            e($e->secteur ?? '—'),
            e($e->adresse ?? '—'),
            e($e->telephone ?? '—'),
            e($e->email ?? '—'),
            e($e->maitre_stage ?? '—'),
            (string)($e->stages_count ?? 0),
        ])->toArray();

        $html = '<p>Total : <strong>' . $entreprises->count() . '</strong> entreprise(s)</p>';
        $html .= DocumentExportService::renderHtmlTable($headers, $rows);

        return DocumentExportService::generateWord(
            'Annuaire des Entreprises Partenaires — ' . $annee,
            $html,
            "annuaire-entreprises-{$annee}"
        );
    }

    public function lettresRecommandationWord(Request $request)
    {
        $annee = $request->annee ?? date('Y') . '-' . (date('Y') + 1);
        $projets = ProjetAcademique::with(['etudiant.user', 'stage.entreprise'])
            ->where('type', 'Stage')->where('statut_actuel', 'Validé')->latest()->get();

        $html = '<p>Total : <strong>' . $projets->count() . '</strong> lettre(s) de recommandation</p>';
        foreach ($projets as $p) {
            $html .= '<hr><p><strong>' . e($p->etudiant?->user?->prenom ?? '') . ' ' . e($p->etudiant?->user?->nom ?? '') . '</strong> — ' . e($p->titre) . '</p>';
            $html .= '<p>Entreprise : ' . e($p->stage?->entreprise?->raison_sociale ?? '—') . '</p>';
        }

        return DocumentExportService::generateWord(
            'Lettres de Recommandation de Stage — ' . $annee,
            $html,
            "lettres-recommandation-{$annee}"
        );
    }

    // ─── HELPERS ──────────────────────────────────────────────────

    private function computeStats($projets): array
    {
        return [
            'total' => $projets->count(),
            'stages' => $projets->where('type', 'Stage')->count(),
            'memoires' => $projets->where('type', 'Memoire')->count(),
            'projets_tutores' => $projets->where('type', 'Projet_Tutore')->count(),
            'valides' => $projets->where('statut_actuel', 'Validé')->count(),
            'en_cours' => $projets->where('statut_actuel', 'En Cours')->count(),
            'soumis' => $projets->where('statut_actuel', 'Sujet Soumis')->count(),
            'a_corriger' => $projets->where('statut_actuel', 'À Corriger')->count(),
            'taux_reussite' => $projets->count() > 0 ? round(($projets->where('statut_actuel', 'Validé')->count() / $projets->count()) * 100, 1) : 0,
        ];
    }

    private function servePdf($pdf, string $filename, Request $request)
    {
        $mode = $request->input('mode', 'download');

        if ($mode === 'preview') {
            return $pdf->stream($filename . '.pdf');
        }

        return $pdf->download($filename . '.pdf');
    }
}
