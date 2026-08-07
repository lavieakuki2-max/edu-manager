<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\ProjetAcademique;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public static function creer(User $destinataire, string $titre, string $message, ?string $lienUrl = null): Notification
    {
        return Notification::create([
            'user_id' => $destinataire->id,
            'titre' => $titre,
            'message' => $message,
            'lien_url' => $lienUrl,
        ]);
    }

    public static function notifierInscriptionEnAttente(User $user): void
    {
        $roleLabel = $user->role === 'enseignant' ? 'enseignant' : 'étudiant';
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            self::creer(
                $admin,
                'Nouveau compte en attente',
                "Un nouveau compte {$roleLabel} ({$user->prenom} {$user->nom}, {$user->email}) attend votre confirmation.",
                route('admin.users.index')
            );
        }
    }

    public static function notifierCompteConfirme(User $user): void
    {
        self::creer(
            $user,
            'Compte confirmé',
            'Votre compte a été confirmé par l\'administrateur. Vous pouvez maintenant vous connecter.',
            route('login')
        );
    }

    public static function notifierCompteRejete(User $user, string $motif): void
    {
        self::creer(
            $user,
            'Demande de compte rejetée',
            "Votre demande de compte a été rejetée. Motif : {$motif}",
            null
        );
    }

    public static function notifierSoumissionSujet(ProjetAcademique $projet): void
    {
        $etudiant = $projet->etudiant->user;
        $typeLabels = ['Stage' => 'Stage', 'Memoire' => 'Memoire', 'Projet_Tutore' => 'Projet Tutoré'];
        $typeLabel = $typeLabels[$projet->type] ?? $projet->type;

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            self::creer(
                $admin,
                'Nouvelle soumission de sujet',
                "Nouvelle soumission de sujet ({$typeLabel}) par {$etudiant->prenom} {$etudiant->nom}.",
                route('projets.show', $projet->id)
            );
        }
    }

    public static function notifierAttributionEnseignant(ProjetAcademique $projet): void
    {
        $etudiant = $projet->etudiant->user;
        $enseignant = $projet->enseignant->user;
        $typeLabels = ['Stage' => 'Stage', 'Memoire' => 'Memoire', 'Projet_Tutore' => 'Projet Tutoré'];
        $typeLabel = $typeLabels[$projet->type] ?? $projet->type;

        self::creer(
            $enseignant,
            'Nouvel étudiant attribué',
            "Un nouvel étudiant {$etudiant->prenom} {$etudiant->nom} vous a été attribué pour le projet ({$typeLabel}) \"{$projet->titre}\".",
            route('projets.show', $projet->id)
        );

        self::creer(
            $etudiant,
            'Sujet validé - Encadreur assigné',
            "Votre sujet \"{$projet->titre}\" a été validé. Votre encadreur est Prof. {$enseignant->prenom} {$enseignant->nom}.",
            route('projets.show', $projet->id)
        );
    }

    public static function notifierTransitionStatut(ProjetAcademique $projet, string $ancienStatut, string $nouveauStatut, string $commentaire = null): void
    {
        $typeLabels = ['Stage' => 'Stage', 'Memoire' => 'Memoire', 'Projet_Tutore' => 'Projet Tutoré'];
        $typeLabel = $typeLabels[$projet->type] ?? $projet->type;
        $commentPart = $commentaire ? " Commentaire: \"{$commentaire}\"" : '';

        $message = "Statut du projet ({$typeLabel}) \"{$projet->titre}\" changé de \"{$ancienStatut}\" vers \"{$nouveauStatut}\".{$commentPart}";
        $url = route('projets.show', $projet->id);

        $destinataires = collect();

        if ($projet->enseignant && $projet->enseignant->user) {
            $destinataires->push($projet->enseignant->user);
        }
        if ($projet->etudiant && $projet->etudiant->user) {
            $destinataires->push($projet->etudiant->user);
        }

        $admins = User::where('role', 'admin')->get();
        $destinataires = $destinataires->merge($admins)->unique('id');

        foreach ($destinataires as $destinataire) {
            self::creer($destinataire, 'Changement de statut', $message, $url);
        }
    }

    public static function notifierCommentaire(ProjetAcademique $projet, User $auteur): void
    {
        $destinataires = collect();

        if ($projet->enseignant && $projet->enseignant->user && $projet->enseignant->user_id !== $auteur->id) {
            $destinataires->push($projet->enseignant->user);
        }
        if ($projet->etudiant && $projet->etudiant->user && $projet->etudiant->user_id !== $auteur->id) {
            $destinataires->push($projet->etudiant->user);
        }

        $url = route('projets.show', $projet->id) . '#commentaires';

        foreach ($destinataires as $destinataire) {
            self::creer(
                $destinataire,
                'Nouveau commentaire',
                "{$auteur->prenom} {$auteur->nom} a commenté sur le projet \"{$projet->titre}\".",
                $url
            );
        }
    }

    public static function notifierPlanificationSoutenance(\App\Models\Soutenance $soutenance): void
    {
        $projet = $soutenance->projet;
        $etudiant = $projet->etudiant->user;
        $encadreur = $projet->enseignant?->user;
        $typeLabels = ['Stage' => 'Stage', 'Memoire' => 'Memoire', 'Projet_Tutore' => 'Projet Tutoré'];
        $typeLabel = $typeLabels[$projet->type] ?? $projet->type;

        $date = \Carbon\Carbon::parse($soutenance->date_soutenance)->locale('fr')->isoFormat('dddd D MMMM YYYY');
        $heure = $soutenance->heure_debut
            ? \Carbon\Carbon::parse($soutenance->heure_debut)->format('H:i')
            : '';

        $message = "Votre soutenance de {$typeLabel} \"{$projet->titre}\" est planifiée le {$date} à {$heure} en salle {$soutenance->salle}.";
        $url = route('etudiant.soutenance');

        if ($etudiant) {
            self::creer($etudiant, 'Soutenance planifiée', $message, $url);
        }
        if ($encadreur) {
            self::creer($encadreur, 'Soutenance planifiée', "Soutenance de {$etudiant->prenom} {$etudiant->nom} planifiée le {$date}.", route('enseignant.soutenances'));
        }

        $juryIds = array_filter([$soutenance->president_id, $soutenance->rapporteur_id, $soutenance->membre_id]);
        foreach ($juryIds as $jid) {
            $jury = \App\Models\Enseignant::find($jid)?->user;
            if ($jury) {
                self::creer($jury, 'Participation jury - Soutenance', "Vous êtes membre du jury pour la soutenance de {$etudiant->prenom} {$etudiant->nom} le {$date} à {$heure}.", route('enseignant.soutenances'));
            }
        }
    }

    public static function notifierResultatSoutenance(\App\Models\Soutenance $soutenance): void
    {
        $projet = $soutenance->projet;
        $etudiant = $projet->etudiant->user;
        $encadreur = $projet->enseignant?->user;

        $message = "Votre soutenance a été notée. Note: {$soutenance->note_finale}/20" . ($soutenance->mention ? " (Mention: {$soutenance->mention})" : '') . ".";
        $url = route('etudiant.soutenance');

        if ($etudiant) {
            self::creer($etudiant, 'Résultat de soutenance', $message, $url);
        }
        if ($encadreur) {
            self::creer($encadreur, 'Résultat de soutenance', "Note de {$etudiant->prenom} {$etudiant->nom}: {$soutenance->note_finale}/20.", route('enseignant.soutenances'));
        }
    }

    public static function notifierChapitreStatut(\App\Models\Chapitre $chapitre, User $auteur): void
    {
        $projet = $chapitre->projet;

        $destinataires = collect();

        if ($projet->enseignant && $projet->enseignant->user && $projet->enseignant->user->id !== $auteur->id) {
            $destinataires->push($projet->enseignant->user);
        }
        if ($projet->etudiant && $projet->etudiant->user && $projet->etudiant->user->id !== $auteur->id) {
            $destinataires->push($projet->etudiant->user);
        }

        $url = route('projets.show', $projet->id) . '#chapitres';

        foreach ($destinataires as $destinataire) {
            self::creer(
                $destinataire,
                'Chapitre mis à jour',
                "Le chapitre \"{$chapitre->titre}\" du projet \"{$projet->titre}\" est passé à \"{$chapitre->statut}\".",
                $url
            );
        }
    }

    public static function notifierDocumentDepose(ProjetAcademique $projet, User $auteur, string $nomFichier): void
    {
        $destinataires = collect();

        if ($projet->enseignant && $projet->enseignant->user && $projet->enseignant->user_id !== $auteur->id) {
            $destinataires->push($projet->enseignant->user);
        }
        if ($projet->etudiant && $projet->etudiant->user && $projet->etudiant->user_id !== $auteur->id) {
            $destinataires->push($projet->etudiant->user);
        }

        $url = route('projets.show', $projet->id) . '#documents';

        foreach ($destinataires as $destinataire) {
            self::creer(
                $destinataire,
                'Nouveau document déposé',
                "{$auteur->prenom} {$auteur->nom} a déposé \"{$nomFichier}\" sur le projet \"{$projet->titre}\".",
                $url
            );
        }
    }
}
