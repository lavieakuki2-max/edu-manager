<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_etudiant_registers_in_pending_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'statut' => 'actif']);

        $response = $this->post('/register', [
            'nom' => 'Konan',
            'prenom' => 'Aya',
            'email' => 'aya.konan@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'etudiant',
            'matricule' => 'MAT-2026-001',
            'classe' => 'L2',
            'filiere' => 'Informatique',
        ]);

        $response->assertSessionHas('status');

        $this->assertDatabaseHas('users', [
            'email' => 'aya.konan@example.com',
            'role' => 'etudiant',
            'statut' => 'en_attente',
        ]);
        $this->assertDatabaseHas('etudiants', ['matricule' => 'MAT-2026-001']);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $admin->id,
            'titre' => 'Nouveau compte en attente',
        ]);

        $this->assertGuest();
    }

    public function test_new_enseignant_registers_in_pending_status(): void
    {
        $this->post('/register', [
            'nom' => 'Traoré',
            'prenom' => 'Issouf',
            'email' => 'issouf.traore@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'enseignant',
            'grade' => 'Maître-Assistant',
            'specialite' => 'Réseaux',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'issouf.traore@example.com',
            'role' => 'enseignant',
            'statut' => 'en_attente',
        ]);
        $this->assertDatabaseHas('enseignants', ['grade' => 'Maître-Assistant']);
    }

    public function test_pending_user_cannot_login(): void
    {
        $user = User::factory()->create(['role' => 'etudiant', 'statut' => 'en_attente']);

        $response = $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/login');
        $this->assertGuest();
    }
}
