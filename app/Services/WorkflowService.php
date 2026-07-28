<?php

namespace App\Services;

use App\Models\ProjetAcademique;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class WorkflowService
{
    const STATUSES = [
        'Sujet Soumis',
        'En Cours',
        'Prêt pour Soutenance',
        'Validé',
        'À Corriger',
    ];

    const TRANSITIONS = [
        'Sujet Soumis' => [
            'En Cours' => ['admin'],
            'À Corriger' => ['admin', 'enseignant'],
        ],
        'En Cours' => [
            'Prêt pour Soutenance' => ['admin', 'enseignant'],
            'À Corriger' => ['admin', 'enseignant'],
        ],
        'Prêt pour Soutenance' => [
            'Validé' => ['admin'],
            'À Corriger' => ['admin', 'enseignant'],
        ],
        'À Corriger' => [
            'En Cours' => ['etudiant'],
        ],
    ];

    public function getAvailableTransitions(ProjetAcademique $projet, User $user): array
    {
        $current = $projet->statut_actuel;
        $available = self::TRANSITIONS[$current] ?? [];

        $result = [];
        foreach ($available as $target => $roles) {
            if (in_array($user->role, $roles, true)) {
                $result[] = $target;
            }
        }

        return $result;
    }

    public function canTransition(ProjetAcademique $projet, string $targetStatus, User $user): bool
    {
        $available = $this->getAvailableTransitions($projet, $user);

        return in_array($targetStatus, $available, true);
    }

    public function transition(ProjetAcademique $projet, string $targetStatus, ?string $commentaire = null): void
    {
        $user = Auth::user();

        if (!$this->canTransition($projet, $targetStatus, $user)) {
            abort(403, 'Transition non autorisée de "' . $projet->statut_actuel . '" vers "' . $targetStatus . '".');
        }

        $ancienStatut = $projet->statut_actuel;

        $projet->update(['statut_actuel' => $targetStatus]);

        $projet->historique()->create([
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => $targetStatus,
            'user_id' => $user->id,
            'commentaire' => $commentaire,
        ]);

        NotificationService::notifierTransitionStatut($projet, $ancienStatut, $targetStatus, $commentaire);
    }
}
