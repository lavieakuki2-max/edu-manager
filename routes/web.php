<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjetController;
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
    Route::post('/projets', [ProjetController::class, 'store'])->middleware('role:etudiant')->name('projets.store');
    Route::patch('/projets/{projet}/statut', [ProjetController::class, 'updateStatut'])->middleware('role:enseignant,admin')->name('projets.statut');
    Route::post('/projets/{projet}/commentaires', [CommentaireController::class, 'store'])->middleware('role:enseignant,admin')->name('projets.commentaires.store');

    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/projets/{projet}/documents', [DocumentController::class, 'store'])->middleware('role:etudiant')->name('documents.store');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    Route::middleware('role:admin')->group(function () {
        Route::patch('/admin/projets/{projet}/assigner', [AdminController::class, 'assigner'])->name('admin.projets.assigner');
        Route::post('/admin/projets/{projet}/soutenance', [AdminController::class, 'planifierSoutenance'])->name('admin.projets.soutenance');
        Route::get('/admin/projets/{projet}/lettre-stage', [AdminController::class, 'lettreStage'])->name('admin.pdf.lettre-stage');
        Route::get('/admin/projets/{projet}/fiche-cotation', [AdminController::class, 'ficheCotation'])->name('admin.pdf.fiche-cotation');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
