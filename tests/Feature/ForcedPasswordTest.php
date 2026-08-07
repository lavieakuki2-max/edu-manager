<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ForcedPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_must_change_password_is_redirected_after_login(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'must_change_password' => true,
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('password.force'));
    }

    public function test_forced_password_page_is_displayed(): void
    {
        $user = User::factory()->create(['must_change_password' => true]);

        $response = $this->actingAs($user)->get(route('password.force'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Auth/ForcedPassword'));
    }

    public function test_other_pages_are_blocked_while_password_change_required(): void
    {
        $user = User::factory()->create(['must_change_password' => true]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertRedirect(route('password.force'));
    }

    public function test_user_can_update_password_and_flag_is_cleared(): void
    {
        $user = User::factory()->create(['must_change_password' => true]);

        $response = $this->actingAs($user)->post(route('password.force.update'), [
            'current_password' => 'password',
            'password' => 'Nouveau-MotDePasse-2026',
            'password_confirmation' => 'Nouveau-MotDePasse-2026',
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertFalse($user->fresh()->must_change_password);
        $this->assertTrue(Hash::check('Nouveau-MotDePasse-2026', $user->fresh()->password));
    }

    public function test_wrong_current_password_is_rejected(): void
    {
        $user = User::factory()->create(['must_change_password' => true]);

        $response = $this->actingAs($user)->from(route('password.force'))->post(route('password.force.update'), [
            'current_password' => 'mauvais-mot-de-passe',
            'password' => 'Nouveau-MotDePasse-2026',
            'password_confirmation' => 'Nouveau-MotDePasse-2026',
        ]);

        $response->assertSessionHasErrors('current_password');
        $this->assertTrue($user->fresh()->must_change_password);
    }
}
