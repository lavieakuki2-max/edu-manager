<?php

namespace Tests\Feature;

use App\Models\Chapitre;
use App\Models\Document;
use App\Models\Enseignant;
use App\Models\Etudiant;
use App\Models\ProjetAcademique;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjetWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function creerEtudiant(): array
    {
        $user = User::factory()->create(['role' => 'etudiant', 'statut' => 'actif']);
        $etudiant = Etudiant::create([
            'user_id' => $user->id,
            'matricule' => 'MAT' . $user->id,
            'classe' => 'L2',
            'filiere' => 'Informatique',
        ]);

        return [$user, $etudiant];
    }

    private function creerEnseignant(): array
    {
        $user = User::factory()->create(['role' => 'enseignant', 'statut' => 'actif']);
        $enseignant = Enseignant::create([
            'user_id' => $user->id,
            'grade' => 'Professeur',
            'specialite' => 'Informatique',
        ]);

        return [$user, $enseignant];
    }

    private function creerAdmin(): User
    {
        return User::factory()->create(['role' => 'admin', 'statut' => 'actif']);
    }

    private function creerProjet(array $attributs = []): array
    {
        [$user, $etudiant] = $this->creerEtudiant();
        [$encUser, $enseignant] = $this->creerEnseignant();

        $projet = ProjetAcademique::create(array_merge([
            'titre' => 'Projet de test',
            'description' => 'Description du projet de test.',
            'type' => 'Memoire',
            'annee_academique' => '2025-2026',
            'statut_actuel' => 'Sujet Soumis',
            'etudiant_id' => $etudiant->id,
            'enseignant_id' => $enseignant->id,
        ], $attributs));

        return [$user, $etudiant, $encUser, $enseignant, $projet];
    }

    public function test_etudiant_can_create_memoire_with_auto_chapters_and_admin_notified(): void
    {
        [$user] = $this->creerEtudiant();
        $admin = $this->creerAdmin();

        $response = $this->actingAs($user)->post(route('projets.store'), [
            'titre' => 'Mon mémoire de fin de cycle',
            'description' => 'Conception d\'une plateforme de gestion académique.',
            'type' => 'Memoire',
            'annee_academique' => '2025-2026',
            'theme_recherche' => 'Système de gestion scolaire',
            'mots_cles' => 'scolarité, gestion',
        ]);

        $response->assertSessionHas('success');

        $projet = ProjetAcademique::where('etudiant_id', $user->etudiant->id)->first();
        $this->assertNotNull($projet);
        $this->assertSame('Sujet Soumis', $projet->statut_actuel);
        $this->assertCount(5, $projet->chapitres);
        $this->assertSame(
            ['Introduction', 'Chapitre 1', 'Chapitre 2', 'Chapitre 3', 'Conclusion'],
            $projet->chapitres->pluck('titre')->all()
        );
        $projet->chapitres->each(fn ($c) => $this->assertSame('En Attente', $c->statut));

        $this->assertDatabaseHas('notifications', [
            'user_id' => $admin->id,
            'titre' => 'Nouvelle soumission de sujet',
        ]);
    }

    public function test_etudiant_can_create_stage_with_new_entreprise(): void
    {
        [$user] = $this->creerEtudiant();

        $response = $this->actingAs($user)->post(route('projets.store'), [
            'titre' => 'Stage chez une entreprise locale',
            'description' => 'Stage en développement web.',
            'type' => 'Stage',
            'annee_academique' => '2025-2026',
            'nouvelle_entreprise' => 'Entreprise Tech SARL',
            'nouvelle_entreprise_adresse' => 'Abidjan',
            'nouvelle_entreprise_telephone' => '0102030405',
            'nouvelle_entreprise_email' => 'contact@tech-sarl.ci',
            'nouvelle_entreprise_maitre_stage' => 'M. Konan',
            'date_debut' => '2026-01-10',
            'date_fin' => '2026-06-30',
            'objectifs_stage' => 'Développer un module de gestion.',
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('entreprises', ['raison_sociale' => 'Entreprise Tech SARL']);
        $projet = ProjetAcademique::where('etudiant_id', $user->etudiant->id)->first();
        $this->assertSame('Stage', $projet->type);
        $this->assertNotNull($projet->stage);
    }

    public function test_enseignant_can_add_chapter(): void
    {
        $admin = $this->creerAdmin();
        [, , , , $projet] = $this->creerProjet();

        $response = $this->actingAs($admin)->post(route('projets.chapitres.store', $projet), [
            'titre' => 'Chapitre 4 — Expérimentation',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('chapitres', [
            'projet_id' => $projet->id,
            'titre' => 'Chapitre 4 — Expérimentation',
            'statut' => 'En Attente',
        ]);
    }

    public function test_etudiant_can_upload_pdf_linked_to_chapter(): void
    {
        Storage::fake('public');

        [, , $encUser, , $projet] = $this->creerProjet();
        $etuUser = $projet->etudiant->user;
        $chapitre = Chapitre::create([
            'projet_id' => $projet->id,
            'titre' => 'Chapitre 1',
            'numero' => 1,
            'statut' => 'En Attente',
        ]);

        $response = $this->actingAs($etuUser)->post(
            route('documents.store', $projet),
            [
                'fichier' => UploadedFile::fake()->create('rapport.pdf', 100, 'application/pdf'),
                'chapitre_id' => $chapitre->id,
            ]
        );

        $response->assertSessionHas('success');

        $doc = Document::where('projet_id', $projet->id)->first();
        $this->assertNotNull($doc);
        $this->assertSame(1, (int) $doc->version);
        $this->assertSame($chapitre->id, $doc->chapitre_id);
        Storage::disk('public')->assertExists($doc->chemin_stockage);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $encUser->id,
            'titre' => 'Nouveau document déposé',
        ]);
    }

    public function test_enseignant_can_comment_on_document_and_student_is_notified(): void
    {
        [, , $encUser, , $projet] = $this->creerProjet();
        $etuUser = $projet->etudiant->user;
        $doc = Document::create([
            'projet_id' => $projet->id,
            'user_id' => $etuUser->id,
            'titre_fichier' => 'rapport-v1.pdf',
            'chemin_stockage' => 'documents/rapport-v1.pdf',
            'version' => 1,
            'date_depot' => now(),
        ]);

        $response = $this->actingAs($encUser)->post(route('projets.commentaires.store', $projet), [
            'contenu' => 'Bonne progression, continuez ainsi.',
            'document_id' => $doc->id,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('commentaires', [
            'projet_id' => $projet->id,
            'document_id' => $doc->id,
            'user_id' => $encUser->id,
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $etuUser->id,
            'titre' => 'Nouveau commentaire',
        ]);
    }

    public function test_enseignant_can_validate_chapter_and_student_is_notified(): void
    {
        [, , $encUser, , $projet] = $this->creerProjet();
        $etuUser = $projet->etudiant->user;
        $chapitre = Chapitre::create([
            'projet_id' => $projet->id,
            'titre' => 'Chapitre 1',
            'numero' => 1,
            'statut' => 'En Attente',
        ]);

        $response = $this->actingAs($encUser)->patch(route('chapitres.statut', $chapitre), [
            'statut' => 'Validé',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('chapitres', ['id' => $chapitre->id, 'statut' => 'Validé']);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $etuUser->id,
            'titre' => 'Chapitre mis à jour',
        ]);
    }
}
