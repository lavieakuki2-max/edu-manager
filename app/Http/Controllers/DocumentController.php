<?php

namespace App\Http\Controllers;

use App\Http\Requests\Projets\StoreDocumentRequest;
use App\Models\Document;
use App\Models\ProjetAcademique;
use App\Services\NotificationService;
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
                ->when($user->role === 'enseignant', fn ($q) => $q->where('enseignant_id', $user->enseignant?->id))
                ->get(),
            'canUpload' => $user->role === 'etudiant' || $user->role === 'enseignant',
        ]);
    }

    public function store(StoreDocumentRequest $request, ProjetAcademique $projet): RedirectResponse
    {
        $validated = $request->validated();

        $version = ((int) $projet->documents()->max('version')) + 1;
        $path = $validated['fichier']->store("projets/{$projet->id}/documents", 'public');

        $doc = $projet->documents()->create([
            'user_id' => $request->user()->id,
            'titre_fichier' => $validated['fichier']->getClientOriginalName(),
            'chemin_stockage' => $path,
            'version' => $version,
            'date_depot' => now(),
        ]);

        NotificationService::notifierDocumentDepose($projet, $request->user(), $doc->titre_fichier);

        return back()->with('success', "Document PDF depose en version {$version}.");
    }

    public function download(Document $document)
    {
        $this->authorize('view', $document);

        if (!Storage::disk('public')->exists($document->chemin_stockage)) {
            return back()->with('error', 'Le fichier n\'existe plus sur le serveur.');
        }

        return Storage::disk('public')->download($document->chemin_stockage, $document->titre_fichier, [
            'Content-Disposition' => 'attachment; filename="' . $document->titre_fichier . '"',
            'Content-Type' => 'application/octet-stream',
        ]);
    }
}
