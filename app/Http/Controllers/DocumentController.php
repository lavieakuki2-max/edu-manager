<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\ProjetAcademique;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Document::with('projet.etudiant.user', 'projet.enseignant.user', 'auteur')->latest('date_depot');

        if ($user->role === 'etudiant') {
            $query->whereHas('projet', fn ($q) => $q->where('etudiant_id', $user->etudiant?->id));
        }

        if ($user->role === 'enseignant') {
            $query->whereHas('projet', fn ($q) => $q->where('enseignant_id', $user->enseignant?->id));
        }

        return Inertia::render('Documents/Index', [
            'documents' => $query->get(),
            'projets' => ProjetAcademique::select('id', 'titre')
                ->when($user->role === 'etudiant', fn ($q) => $q->where('etudiant_id', $user->etudiant?->id))
                ->get(),
            'canUpload' => $user->role === 'etudiant',
        ]);
    }

    public function store(Request $request, ProjetAcademique $projet): RedirectResponse
    {
        $this->authorize('upload', [Document::class, $projet]);

        $validated = $request->validate([
            'fichier' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        $version = ((int) $projet->documents()->max('version')) + 1;
        $path = $validated['fichier']->store("projets/{$projet->id}/documents", 'public');

        $projet->documents()->create([
            'user_id' => $request->user()->id,
            'titre_fichier' => $validated['fichier']->getClientOriginalName(),
            'chemin_stockage' => $path,
            'version' => $version,
            'date_depot' => now(),
        ]);

        return back()->with('success', "Document PDF déposé en version {$version}.");
    }

    public function download(Document $document)
    {
        $this->authorize('view', $document);

        return Storage::disk('public')->download($document->chemin_stockage, $document->titre_fichier);
    }
}
