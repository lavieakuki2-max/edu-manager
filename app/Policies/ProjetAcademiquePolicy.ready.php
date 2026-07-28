<?php

namespace App\Policies;

use App\Models\ProjetAcademique;
use App\Models\User;

class ProjetAcademiquePolicy
{
    public function view(User $user, ProjetAcademique $projet): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'etudiant') {
            return $user->etudiant?->id === $projet->etudiant_id;
        }

        return $user->enseignant?->id === $projet->enseignant_id;
    }

    public function update(User $user, ProjetAcademique $projet): bool
    {
        return $user->role === 'admin' || $user->enseignant?->id === $projet->enseignant_id;
    }

    public function submit(User $user): bool
    {
        return $user->role === 'etudiant' && $user->etudiant !== null;
    }

    public function assign(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function comment(User $user, ProjetAcademique $projet): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'etudiant') {
            return $user->etudiant?->id === $projet->etudiant_id;
        }

        return $user->enseignant?->id === $projet->enseignant_id;
    }
}
