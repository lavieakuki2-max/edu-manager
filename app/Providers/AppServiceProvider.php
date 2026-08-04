<?php

namespace App\Providers;

use App\Models\Commentaire;
use App\Models\Document;
use App\Models\ProjetAcademique;
use App\Policies\CommentairePolicy;
use App\Policies\DocumentPolicy;
use App\Policies\ProjetAcademiquePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL; // <-- 1. IMPORT AJOUTÉ
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Force le HTTPS en production UNIQUEMENT hors localhost.
        // En local (127.0.0.1/localhost) on garde http:// sinon le navigateur
        // tente une connexion TLS inexistante sur php artisan serve -> écran blanc.
        $request = $this->app->request;
        $host = $request?->getHost();
        $isLocal = in_array($host, ['127.0.0.1', 'localhost', '::1'], true);
        if ($this->app->environment('production') && !$isLocal) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);

        Gate::policy(ProjetAcademique::class, ProjetAcademiquePolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(Commentaire::class, CommentairePolicy::class);
    }
}