<?php

namespace App\Http\Controllers;

use App\Http\Requests\Projets\StoreCommentaireRequest;
use App\Models\ProjetAcademique;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class CommentaireController extends Controller
{
    public function store(StoreCommentaireRequest $request, ProjetAcademique $projet): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $projet->commentaires()->create([
                'user_id' => $request->user()->id,
                'contenu' => $validated['contenu'],
                'document_id' => $validated['document_id'] ?? null,
            ]);

            NotificationService::notifierCommentaire($projet, $request->user());

            return back()->with('success', 'Commentaire ajouté.');
        } catch (\Exception $e) {
            Log::error('Erreur ajout commentaire: ' . $e->getMessage());
            return back()->with('error', 'Erreur lors de l\'ajout du commentaire.');
        }
    }
}
