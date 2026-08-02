<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ParametresController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Parametres', [
            'settings' => settings_all(),
        ]);
    }

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'universite_nom' => ['required', 'string', 'max:255'],
                'universite_sigle' => ['required', 'string', 'max:50'],
                'faculte' => ['nullable', 'string', 'max:255'],
                'ministere_tutelle' => ['nullable', 'string', 'max:255'],
                'pays' => ['nullable', 'string', 'max:255'],
                'ville' => ['nullable', 'string', 'max:255'],
                'devise' => ['nullable', 'string', 'max:255'],
                'annee_academique_active' => ['nullable', 'string', 'max:20', 'regex:/^\d{4}-\d{4}$/'],
                'annee_execution' => ['nullable', 'string', 'max:10'],
                'universite_logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            ]);

            if ($request->hasFile('universite_logo')) {
                $old = setting('universite_logo');
                if ($old && Storage::disk('public')->exists($old)) {
                    Storage::disk('public')->delete($old);
                }

                $path = $request->file('universite_logo')->store('settings', 'public');
                $validated['universite_logo'] = $path;
            }

            app(SettingService::class)->setMany($validated);

            return back()->with('success', 'Paramètres institutionnels mis à jour avec succès.');
        } catch (\Throwable $e) {
            Log::error('ParametresController::update — ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return back()->withErrors(['error' => 'Une erreur est survenue lors de la sauvegarde des paramètres.']);
        }
    }
}
