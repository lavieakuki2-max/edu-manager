<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\ProjetAcademique;
use App\Models\User;

class DocumentPolicy
{
    public function view(User $user, Document $document): bool
    {
        return $user->can('view', $document->projet);
    }

    public function upload(User $user, ProjetAcademique $projet): bool
    {
        return $user->role === 'etudiant' && $user->etudiant?->id === $projet->etudiant_id;
    }
}
