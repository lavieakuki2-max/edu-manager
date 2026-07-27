<?php

namespace App\Http\Controllers;

use App\Models\ProjetAcademique;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentaireController extends Controller
{
    public function store(Request $request, ProjetAcademique $projet): RedirectResponse
    {
        $this->authorize('update', $projet);

        $validated = $request->validate([
            'contenu' => ['required', 'string', 'max:2000'],
        ]);

        $projet->commentaires()->create([
            'user_id' => $request->user()->id,
            'contenu' => $validated['contenu'],
        ]);

        return back()->with('success', 'Commentaire ajouté.');
    }
}
