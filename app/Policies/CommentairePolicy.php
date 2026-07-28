<?php

namespace App\Policies;

use App\Models\Commentaire;
use App\Models\User;

class CommentairePolicy
{
    public function create(User $user, Commentaire $commentaire): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        $projet = $commentaire->projet;

        if ($user->role === 'etudiant') {
            return $user->etudiant?->id === $projet->etudiant_id;
        }

        return $user->enseignant?->id === $projet->enseignant_id;
    }
}
