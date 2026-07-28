<?php

namespace App\Http\Controllers;

use App\Http\Requests\Projets\StoreCommentaireRequest;
use App\Models\ProjetAcademique;
use Illuminate\Http\RedirectResponse;

class CommentaireController extends Controller
{
    public function store(StoreCommentaireRequest $request, ProjetAcademique $projet): RedirectResponse
    {
        $validated = $request->validated();

        $projet->commentaires()->create([
            'user_id' => $request->user()->id,
            'contenu' => $validated['contenu'],
        ]);

        return back()->with('success', 'Commentaire ajouté.');
    }
}
