<?php

namespace App\Providers;

use App\Models\Commentaire;
use App\Models\Document;
use App\Models\ProjetAcademique;
use App\Policies\CommentairePolicy;
use App\Policies\DocumentPolicy;
use App\Policies\ProjetAcademiquePolicy;
use Illuminate\Support\Facades\Gate;
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
        Vite::prefetch(concurrency: 3);

        Gate::policy(ProjetAcademique::class, ProjetAcademiquePolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(Commentaire::class, CommentairePolicy::class);
    }
}
