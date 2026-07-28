<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EntrepriseController;
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
    Route::post('/projets/{projet}/documents', [DocumentController::class, 'store'])->middleware('role:etudiant')->name('documents.store');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    Route::middleware('role:admin')->group(function () {
        Route::patch('/admin/projets/{projet}/assigner', [AdminController::class, 'assigner'])->name('admin.projets.assigner');
        Route::post('/admin/projets/{projet}/soutenance', [AdminController::class, 'planifierSoutenance'])->name('admin.projets.soutenance');
        Route::get('/admin/projets/{projet}/lettre-stage', [AdminController::class, 'lettreStage'])->name('admin.pdf.lettre-stage');
        Route::get('/admin/projets/{projet}/fiche-cotation', [AdminController::class, 'ficheCotation'])->name('admin.pdf.fiche-cotation');
        Route::get('/admin/rapport-global', [AdminController::class, 'rapportGlobal'])->name('admin.pdf.rapport-global');

        Route::get('/admin/utilisateurs', [UserController::class, 'index'])->name('admin.users.index');
        Route::post('/admin/utilisateurs', [UserController::class, 'store'])->name('admin.users.store');
        Route::patch('/admin/utilisateurs/{user}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/admin/utilisateurs/{user}', [UserController::class, 'destroy'])->name('admin.users.delete');

        Route::get('/admin/entreprises', [EntrepriseController::class, 'index'])->name('admin.entreprises.index');
        Route::post('/admin/entreprises', [EntrepriseController::class, 'store'])->name('admin.entreprises.store');
        Route::patch('/admin/entreprises/{entreprise}', [EntrepriseController::class, 'update'])->name('admin.entreprises.update');
        Route::delete('/admin/entreprises/{entreprise}', [EntrepriseController::class, 'destroy'])->name('admin.entreprises.delete');

        Route::get('/admin/soutenances', [SoutenanceController::class, 'index'])->name('admin.soutenances.index');
        Route::post('/admin/soutenances', [SoutenanceController::class, 'store'])->name('admin.soutenances.store');
        Route::patch('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'update'])->name('admin.soutenances.update');
        Route::delete('/admin/soutenances/{soutenance}', [SoutenanceController::class, 'destroy'])->name('admin.soutenances.delete');

        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
