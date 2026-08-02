<?php

use App\Services\SettingService;

if (! function_exists('setting')) {
    /**
     * Retourne un paramètre institutionnel dynamique.
     */
    function setting(string $key, $default = null)
    {
        return app(SettingService::class)->get($key, $default);
    }
}

if (! function_exists('settings_all')) {
    /**
     * Retourne tous les paramètres institutionnels.
     */
    function settings_all(): array
    {
        return app(SettingService::class)->all();
    }
}

if (! function_exists('anneeAcademique')) {
    /**
     * Année académique courante (ex: 2025-2026), calculée sur base de la date
     * du jour (septembre -> juin), avec surcharge administrative possible.
     */
    function anneeAcademique(): string
    {
        $override = setting('annee_academique_active');

        if ($override) {
            return $override;
        }

        $now = now();
        $debut = $now->month >= 9 ? $now->year : $now->year - 1;

        return $debut . '-' . ($debut + 1);
    }
}

if (! function_exists('anneeExecution')) {
    /**
     * Année d'exécution courante (ex: 2026), avec surcharge administrative.
     */
    function anneeExecution(): string
    {
        $override = setting('annee_execution');

        return $override ?: (string) now()->year;
    }
}

if (! function_exists('institution')) {
    /**
     * Identité institutionnelle complète pour les papiers en-tête.
     */
    function institution(): array
    {
        return [
            'nom' => setting('universite_nom', 'Université'),
            'sigle' => setting('universite_sigle', ''),
            'logo' => setting('universite_logo'),
            'faculte' => setting('faculte', ''),
            'ministere_tutelle' => setting('ministere_tutelle', ''),
            'pays' => setting('pays', ''),
            'ville' => setting('ville', ''),
            'devise' => setting('devise', ''),
            'annee_academique' => anneeAcademique(),
            'annee_execution' => anneeExecution(),
        ];
    }
}
