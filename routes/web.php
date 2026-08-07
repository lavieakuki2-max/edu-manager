<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\ParametresController;
use App\Http\Controllers\Admin\ProjetController as AdminProjetController;
use App\Http\Controllers\Admin\RapportController;
use App\Http\Controllers\Admin\StageSuiviController as AdminStageSuiviController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\ChapitreController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\EnseignantController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjetController;
use App\Http\Controllers\SoutenanceController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/projets', [ProjetController::class, 'index'])->name('projets.index');
    Route::get('/projets/{projet}', [ProjetController::class, 'show'])->name('projets.show');
    Route::post('/projets', [ProjetController::class, 'store'])->middleware('role:etudiant')->name('projets.store');
    Route::patch('/projets/{projet}/statut', [ProjetController::class, 'updateStatut'])->middleware('role:enseignant,admin')->name('projets.statut');
    Route::post('/projets/{projet}/commentaires', [CommentaireController::class, 'store'])->name('projets.commentaires.store');

    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/projets/{projet}/documents', [DocumentController::class, 'store'])->middleware('role:etudiant,enseignant')->name('documents.store');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    Route::post('/projets/{projet}/chapitres', [ChapitreController::class, 'store'])->middleware('role:admin,enseignant')->name('projets.chapitres.store');
    Route::patch('/chapitres/{chapitre}/statut', [ChapitreController::class, 'updateStatut'])->middleware('role:admin,enseignant')->name('chapitres.statut');
    Route::delete('/chapitres/{chapitre}', [ChapitreController::class, 'destroy'])->middleware('role:admin,enseignant')->name('chapitres.destroy');

    Route::get('/entreprises/search', [EntrepriseController::class, 'search'])->name('entreprises.search');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::post('/notifications/{notification}/redirect', [NotificationController::class, 'redirect'])->name('notifications.redirect');

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/projets', [AdminProjetController::class, 'index'])->name('admin.projets.index');
        Route::patch('/admin/projets/{projet}/assigner', [AdminController::class, 'assigner'])->name('admin.projets.assigner');
        Route::post('/admin/projets/{projet}/soutenance', [AdminController::class, 'planifierSoutenance'])->name('admin.projets.soutenance');
        Route::get('/admin/projets/{projet}/lettre-stage', [AdminController::class, 'lettreStage'])->name('admin.pdf.lettre-stage');
        Route::get('/admin/projets/{projet}/fiche-cotation', [AdminController::class, 'ficheCotation'])->name('admin.pdf.fiche-cotation');
        Route::get('/admin/rapport-global', [AdminController::class, 'rapportGlobal'])->name('admin.pdf.rapport-global');

        Route::get('/admin/utilisateurs', [UserController::class, 'index'])->name('admin.users.index');
        Route::post('/admin/utilisateurs', [UserController::class, 'store'])->name('admin.users.store');
        Route::patch('/admin/utilisateurs/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::post('/admin/utilisateurs/{user}/confirmer', [UserController::class, 'confirm'])->name('admin.users.confirm');
        Route::post('/admin/utilisateurs/{user}/rejeter', [UserController::class, 'reject'])->name('admin.users.reject');
        Route::delete('/admin/utilisateurs/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

        Route::get('/admin/entreprises', [EntrepriseController::class, 'index'])->name('admin.entreprises.index');
        Route::get('/admin/entreprises/export', [EntrepriseController::class, 'export'])->name('admin.entreprises.export');
        Route::get('/admin/entreprises/{entreprise}', [EntrepriseController::class, 'show'])->name('admin.entreprises.show');
        Route::post('/admin/entreprises', [EntrepriseController::class, 'store'])->name('admin.entreprises.store');
        Route::patch('/admin/entreprises/{entreprise}', [EntrepriseController::class, 'update'])->name('admin.entreprises.update');
        Route::delete('/admin/entreprises/{entreprise}', [EntrepriseController::class, 'destroy'])->name('admin.entreprises.delete');

        Route::get('/admin/soutenances', [SoutenanceController::class, 'index'])->name('admin.soutenances.index');
        Route::post('/admin/soutenances', [SoutenanceController::class, 'store'])->name('admin.soutenances.store');
        Route::patch('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'update'])->name('admin.soutenances.update');
        Route::delete('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'destroy'])->name('admin.soutenances.delete');

        Route::get('/admin/rapports', [RapportController::class, 'index'])->name('admin.rapports');
        Route::get('/admin/rapports/statistique', [RapportController::class, 'rapportStatistique'])->name('admin.pdf.statistique');
        Route::get('/admin/rapports/statistique/word', [RapportController::class, 'rapportStatistiqueWord'])->name('admin.pdf.statistique.word');
        Route::get('/admin/rapports/etudiants-valides', [RapportController::class, 'listeEtudiantsValides'])->name('admin.pdf.etudiants-valides');
        Route::get('/admin/rapports/etudiants-valides/word', [RapportController::class, 'listeEtudiantsValidesWord'])->name('admin.pdf.etudiants-valides.word');
        Route::get('/admin/rapports/lettres-recommandation', [RapportController::class, 'lettresRecommandation'])->name('admin.pdf.lettres-recommandation');
        Route::get('/admin/rapports/lettres-recommandation/word', [RapportController::class, 'lettresRecommandationWord'])->name('admin.pdf.lettres-recommandation.word');
        Route::get('/admin/rapports/grille-cotation/{projet}', [RapportController::class, 'grilleCotation'])->name('admin.pdf.grille-cotation');
        Route::get('/admin/rapports/repartition-enseignants', [RapportController::class, 'repartitionEnseignants'])->name('admin.pdf.repartition-enseignants');
        Route::get('/admin/rapports/repartition-enseignants/word', [RapportController::class, 'repartitionEnseignantsWord'])->name('admin.pdf.repartition-enseignants.word');
        Route::get('/admin/rapports/annuaire-entreprises', [RapportController::class, 'annuaireEntreprises'])->name('admin.pdf.annuaire-entreprises');
        Route::get('/admin/rapports/annuaire-entreprises/word', [RapportController::class, 'annuaireEntreprisesWord'])->name('admin.pdf.annuaire-entreprises.word');
        Route::get('/admin/rapports/attestation/{projet}', [RapportController::class, 'attestationValidation'])->name('admin.pdf.attestation');
        Route::get('/admin/rapports/pv-soutenance/{projet}', [RapportController::class, 'pvSoutenance'])->name('admin.pdf.pv-soutenance');

        Route::get('/admin/stages', [AdminStageSuiviController::class, 'index'])->name('admin.stages.index');
        Route::get('/admin/stages/{stage}', [AdminStageSuiviController::class, 'show'])->name('admin.stages.show');
        Route::patch('/admin/stages/{stage}/statut', [AdminStageSuiviController::class, 'updateStatut'])->name('admin.stages.statut');

        Route::get('/admin/parametres', [ParametresController::class, 'index'])->name('admin.parametres.index');
        Route::patch('/admin/parametres', [ParametresController::class, 'update'])->name('admin.parametres.update');
    });

    Route::middleware('role:enseignant')->group(function () {
        Route::get('/enseignant/etudiants', [EnseignantController::class, 'mesEtudiants'])->name('enseignant.etudiants');
        Route::get('/enseignant/commentaires', [EnseignantController::class, 'commentaires'])->name('enseignant.commentaires');
        Route::get('/enseignant/soutenances', [EnseignantController::class, 'soutenances'])->name('enseignant.soutenances');
        Route::get('/enseignant/documents', [EnseignantController::class, 'documents'])->name('enseignant.documents');
        Route::post('/enseignant/soutenances/{soutenance}/evaluer', [SoutenanceController::class, 'evaluation'])->name('enseignant.soutenances.evaluation');
    });

    Route::middleware('role:etudiant')->group(function () {
        Route::get('/etudiant/discussions', [EtudiantController::class, 'discussions'])->name('etudiant.discussions');
        Route::get('/etudiant/soutenance', [EtudiantController::class, 'maSoutenance'])->name('etudiant.soutenance');
        Route::get('/etudiant/stage', [EtudiantController::class, 'suiviStage'])->name('etudiant.stage');
        Route::get('/etudiant/stage/lettre', [EtudiantController::class, 'downloadLettreStage'])->name('etudiant.stage.lettre');
        Route::post('/etudiant/stage/journal', [EtudiantController::class, 'journalStore'])->name('etudiant.stage.journal.store');
        Route::put('/etudiant/stage/journal/{journal}', [EtudiantController::class, 'journalUpdate'])->name('etudiant.stage.journal.update');
        Route::delete('/etudiant/stage/journal/{journal}', [EtudiantController::class, 'journalDestroy'])->name('etudiant.stage.journal.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto'])->name('profile.photo.destroy');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
