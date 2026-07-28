<?php

namespace Database\Seeders;

use App\Models\Commentaire;
use App\Models\Document;
use App\Models\Enseignant;
use App\Models\Entreprise;
use App\Models\Etudiant;
use App\Models\ProjetAcademique;
use App\Models\Soutenance;
use Illuminate\Database\Seeder;

class ProjetSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = Etudiant::with('user')->get();
        $enseignants = Enseignant::with('user')->get();
        $entreprises = Entreprise::all();

        $projets = [
            [
                'titre' => 'Plateforme de suivi des stages a l\'UNILUK',
                'description' => 'Conception et developpement d\'un systeme web pour le suivi en temps reel des stages et memoires des etudiants de l\'UNILUK.',
                'type' => 'Memoire',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'Validé',
                'etudiant_idx' => 0,
                'enseignant_idx' => 0,
                'memoire' => ['theme_recherche' => 'Digitalisation du suivi academique', 'mots_cles' => 'Laravel, Inertia, workflow'],
                'commentaires' => [
                    ['auteur_idx' => 0, 'contenu' => 'Bien vu. Preciser la problematique et les limites du systeme.'],
                    ['auteur_idx' => -1, 'contenu' => 'Merci prof. J\'ai ajoute un paragraphe sur les contraintes techniques.'],
                    ['auteur_idx' => 0, 'contenu' => 'Corriger la methodology de collecte de donnees.'],
                ],
                'has_soutenance' => true,
                'soutenance' => ['date_soutenance' => '2026-06-15', 'salle' => 'Amphitheatre A', 'note_finale' => 14.5],
            ],
            [
                'titre' => 'Audit du reseau local de la clinique',
                'description' => 'Analyse et amelioration de l\'infrastructure reseau existante de la Clinique Adventiste de Lukanga.',
                'type' => 'Stage',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'En Cours',
                'etudiant_idx' => 1,
                'enseignant_idx' => 1,
                'stage' => [
                    'entreprise_idx' => 0,
                    'date_debut' => '2026-03-01',
                    'date_fin' => '2026-05-30',
                    'objectifs_stage' => 'Cartographier le reseau, identifier les risques et proposer un plan de securisation.',
                ],
                'commentaires' => [
                    ['auteur_idx' => 1, 'contenu' => 'Rapport intermediaire requis avant le 15 avril.'],
                    ['auteur_idx' => -1, 'contenu' => 'Compris, je travaille sur la topologie reseau.'],
                ],
            ],
            [
                'titre' => 'Gestion numerique des archives administratives',
                'description' => 'Prototype de classement et recherche des documents administratifs utilisant une GED.',
                'type' => 'Memoire',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'Sujet Soumis',
                'etudiant_idx' => 2,
                'enseignant_idx' => null,
                'memoire' => ['theme_recherche' => 'Archivage electronique', 'mots_cles' => 'GED, recherche, universite'],
            ],
            [
                'titre' => 'Systeme de gestion des notes en ligne',
                'description' => 'Application web pour la saisie, consultation et gestion des notes des etudiants par les enseignants.',
                'type' => 'Memoire',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'En Cours',
                'etudiant_idx' => 3,
                'enseignant_idx' => 2,
                'memoire' => ['theme_recherche' => 'Gestion academique', 'mots_cles' => 'React, Laravel, API REST'],
                'commentaires' => [
                    ['auteur_idx' => 2, 'contenu' => 'L\'architecture API est bien pensee. Poursuivre.'],
                    ['auteur_idx' => -1, 'contenu' => 'Merci. Le frontend React avance bien.'],
                ],
            ],
            [
                'titre' => 'Audit de securite informatique a la SNEL',
                'description' => 'Evaluation de la posture de securite des systemes d\'information de la SNEL.',
                'type' => 'Stage',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'À Corriger',
                'etudiant_idx' => 4,
                'enseignant_idx' => 0,
                'stage' => [
                    'entreprise_idx' => 1,
                    'date_debut' => '2026-02-01',
                    'date_fin' => '2026-04-30',
                    'objectifs_stage' => 'Realiser un audit complet et proposer un plan de renforcement.',
                ],
                'commentaires' => [
                    ['auteur_idx' => 0, 'contenu' => 'Le rapport manque de details sur les vulnerabilites identifiees. A revoir.'],
                    ['auteur_idx' => -1, 'contenu' => 'Je vais enrichir la section recommandations.'],
                    ['auteur_idx' => 0, 'contenu' => 'Ajouter les captures d\'ecran des tests effectues.'],
                ],
            ],
            [
                'titre' => 'Application mobile de microfinance',
                'description' => 'Developpement d\'une application mobile pour la gestion de microcredits et epargne.',
                'type' => 'Memoire',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'Sujet Soumis',
                'etudiant_idx' => 5,
                'enseignant_idx' => null,
                'memoire' => ['theme_recherche' => 'Finance numerique', 'mots_cles' => 'Flutter, Laravel, mobile'],
            ],
            [
                'titre' => 'Mise en place d\'un site web institutionnel',
                'description' => 'Conception et deploiement du site web officiel pour le Ministere de l\'Enseignement Superieur.',
                'type' => 'Stage',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'Prêt pour Soutenance',
                'etudiant_idx' => 6,
                'enseignant_idx' => 3,
                'stage' => [
                    'entreprise_idx' => 3,
                    'date_debut' => '2026-01-15',
                    'date_fin' => '2026-04-15',
                    'objectifs_stage' => 'Developper et deployer un site responsive et moderne.',
                ],
                'commentaires' => [
                    ['auteur_idx' => 3, 'contenu' => 'Excellent travail. Le design est conforme aux attentes.'],
                    ['auteur_idx' => -1, 'contenu' => 'Merci! Les tests utilisateurs sont termines.'],
                ],
            ],
            [
                'titre' => 'Plateforme e-learning pour l\'UNILUK',
                'description' => 'Developpement d\'une plateforme de cours en ligne avec suivi de progression.',
                'type' => 'Memoire',
                'annee_academique' => '2025-2026',
                'statut_actuel' => 'En Cours',
                'etudiant_idx' => 7,
                'enseignant_idx' => 1,
                'memoire' => ['theme_recherche' => 'E-learning', 'mots_cles' => 'Moodle, video, streaming'],
                'commentaires' => [
                    ['auteur_idx' => 1, 'contenu' => 'Pensez a integrer un systeme de quiz interactif.'],
                    ['auteur_idx' => -1, 'contenu' => 'Bonne idee, j\'ai commence le module quiz.'],
                ],
            ],
        ];

        foreach ($projets as $data) {
            $projet = ProjetAcademique::updateOrCreate(
                ['titre' => $data['titre']],
                [
                    'description' => $data['description'],
                    'type' => $data['type'],
                    'annee_academique' => $data['annee_academique'],
                    'statut_actuel' => $data['statut_actuel'],
                    'etudiant_id' => $etudiants[$data['etudiant_idx']]->id ?? null,
                    'enseignant_id' => $enseignants[$data['enseignant_idx']]->id ?? null,
                ]
            );

            if (isset($data['memoire'])) {
                $projet->memoire()->updateOrCreate(
                    ['projet_id' => $projet->id],
                    $data['memoire']
                );
            }

            if (isset($data['stage'])) {
                $projet->stage()->updateOrCreate(
                    ['projet_id' => $projet->id],
                    [
                        'entreprise_id' => $entreprises[$data['stage']['entreprise_idx']]->id,
                        'date_debut' => $data['stage']['date_debut'],
                        'date_fin' => $data['stage']['date_fin'],
                        'objectifs_stage' => $data['stage']['objectifs_stage'],
                    ]
                );
            }

            if (isset($data['commentaires'])) {
                foreach ($data['commentaires'] as $c) {
                    $auteurId = $c['auteur_idx'] === -1
                        ? $etudiants[$data['etudiant_idx']]->user_id
                        : $enseignants[$c['auteur_idx']]->user_id;

                    Commentaire::updateOrCreate(
                        ['projet_id' => $projet->id, 'user_id' => $auteurId, 'contenu' => $c['contenu']],
                        ['projet_id' => $projet->id, 'user_id' => $auteurId, 'contenu' => $c['contenu']]
                    );
                }
            }

            if (isset($data['soutenance'])) {
                Soutenance::updateOrCreate(
                    ['projet_id' => $projet->id],
                    $data['soutenance']
                );
            }
        }
    }
}
