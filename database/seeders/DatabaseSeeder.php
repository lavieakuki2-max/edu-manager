<?php

namespace Database\Seeders;

use App\Models\Enseignant;
use App\Models\Entreprise;
use App\Models\Etudiant;
use App\Models\ProjetAcademique;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(['email' => 'admin@uniluk.edu'], [
            'nom' => 'Bureau',
            'prenom' => 'Stages',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $enseignants = collect([
            ['nom' => 'Mavungu', 'prenom' => 'Daniel', 'email' => 'daniel.mavungu@uniluk.edu', 'grade' => 'Professeur', 'specialite' => 'Genie logiciel'],
            ['nom' => 'Kambale', 'prenom' => 'Esther', 'email' => 'esther.kambale@uniluk.edu', 'grade' => 'Chef de travaux', 'specialite' => 'Reseaux et systemes'],
        ])->map(function (array $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'password' => Hash::make('password'),
                'role' => 'enseignant',
            ]);

            return Enseignant::updateOrCreate(['user_id' => $user->id], [
                'grade' => $data['grade'],
                'specialite' => $data['specialite'],
            ]);
        });

        $entreprise = Entreprise::updateOrCreate(['raison_sociale' => 'Clinique Adventiste de Lukanga'], [
            'raison_sociale' => 'Clinique Adventiste de Lukanga',
            'adresse' => 'Lukanga, Nord-Kivu',
            'telephone' => '+243 990 000 001',
            'maitre_stage' => 'Ir. Patient Kitsa',
        ]);

        $etudiants = collect([
            ['nom' => 'Kasereka', 'prenom' => 'Jean', 'email' => 'jean.kasereka@uniluk.edu', 'matricule' => 'UNILUK-L2-001', 'classe' => 'L2', 'filiere' => 'Informatique'],
            ['nom' => 'Amani', 'prenom' => 'Grace', 'email' => 'grace.amani@uniluk.edu', 'matricule' => 'UNILUK-L2-002', 'classe' => 'L2', 'filiere' => 'Informatique'],
            ['nom' => 'Safari', 'prenom' => 'Moise', 'email' => 'moise.safari@uniluk.edu', 'matricule' => 'UNILUK-L2-003', 'classe' => 'L2', 'filiere' => 'Gestion'],
        ])->map(function (array $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'password' => Hash::make('password'),
                'role' => 'etudiant',
            ]);

            return Etudiant::updateOrCreate(['user_id' => $user->id], [
                'matricule' => $data['matricule'],
                'classe' => $data['classe'],
                'filiere' => $data['filiere'],
            ]);
        });

        $memoire = ProjetAcademique::updateOrCreate(['titre' => 'Plateforme de suivi des stages a l UNILUK'], [
            'titre' => 'Plateforme de suivi des stages a l UNILUK',
            'description' => 'Conception et developpement d un systeme de suivi des stages et memoires.',
            'type' => 'Memoire',
            'annee_academique' => '2025-2026',
            'statut_actuel' => 'En Cours',
            'etudiant_id' => $etudiants[0]->id,
            'enseignant_id' => $enseignants[0]->id,
        ]);
        $memoire->memoire()->updateOrCreate(['projet_id' => $memoire->id], ['theme_recherche' => 'Digitalisation du suivi academique', 'mots_cles' => 'Laravel, Inertia, workflow']);
        $memoire->commentaires()->updateOrCreate(['user_id' => $enseignants[0]->user_id, 'contenu' => 'Preciser la problematique et les limites du systeme.']);

        $stage = ProjetAcademique::updateOrCreate(['titre' => 'Audit du reseau local de la clinique'], [
            'titre' => 'Audit du reseau local de la clinique',
            'description' => 'Analyse et amelioration de l infrastructure reseau existante.',
            'type' => 'Stage',
            'annee_academique' => '2025-2026',
            'statut_actuel' => 'Sujet Soumis',
            'etudiant_id' => $etudiants[1]->id,
            'enseignant_id' => $enseignants[1]->id,
        ]);
        $stage->stage()->updateOrCreate(['projet_id' => $stage->id], [
            'entreprise_id' => $entreprise->id,
            'date_debut' => '2026-03-01',
            'date_fin' => '2026-05-30',
            'objectifs_stage' => 'Cartographier le reseau, identifier les risques et proposer un plan de securisation.',
        ]);

        $projetLibre = ProjetAcademique::updateOrCreate(['titre' => 'Gestion numerique des archives administratives'], [
            'titre' => 'Gestion numerique des archives administratives',
            'description' => 'Prototype de classement et recherche des documents administratifs.',
            'type' => 'Memoire',
            'annee_academique' => '2025-2026',
            'statut_actuel' => 'Sujet Soumis',
            'etudiant_id' => $etudiants[2]->id,
        ]);
        $projetLibre->memoire()->updateOrCreate(['projet_id' => $projetLibre->id], ['theme_recherche' => 'Archivage electronique', 'mots_cles' => 'GED, recherche, universite']);

        $admin->documents()->updateOrCreate(['projet_id' => $memoire->id, 'titre_fichier' => 'canevas-memoire.pdf'], [
            'projet_id' => $memoire->id,
            'titre_fichier' => 'canevas-memoire.pdf',
            'chemin_stockage' => 'documents/demo/canevas-memoire.pdf',
            'version' => 1,
            'date_depot' => now(),
        ]);
    }
}
