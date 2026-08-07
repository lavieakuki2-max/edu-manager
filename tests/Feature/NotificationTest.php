<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unread_count_returns_current_count(): void
    {
        $user = User::factory()->create();
        Notification::create(['user_id' => $user->id, 'titre' => 'T1', 'message' => 'M1']);
        Notification::create(['user_id' => $user->id, 'titre' => 'T2', 'message' => 'M2']);

        $response = $this->actingAs($user)->getJson(route('notifications.unreadCount'));

        $response->assertOk()
            ->assertJson(['unread_count' => 2]);
    }

    public function test_unread_count_only_counts_own_notifications(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Notification::create(['user_id' => $other->id, 'titre' => 'T1', 'message' => 'M1']);

        $response = $this->actingAs($user)->getJson(route('notifications.unreadCount'));

        $response->assertOk()
            ->assertJson(['unread_count' => 0]);
    }

    public function test_index_returns_notifications_and_unread_count(): void
    {
        $user = User::factory()->create();
        Notification::create(['user_id' => $user->id, 'titre' => 'T1', 'message' => 'M1']);
        Notification::create(['user_id' => $user->id, 'titre' => 'T2', 'message' => 'M2', 'est_lu' => true]);

        $response = $this->actingAs($user)->getJson(route('notifications.index'));

        $response->assertOk()
            ->assertJsonCount(2, 'notifications')
            ->assertJson(['unread_count' => 1]);
    }

    public function test_mark_as_read_updates_count(): void
    {
        $user = User::factory()->create();
        $notification = Notification::create(['user_id' => $user->id, 'titre' => 'T1', 'message' => 'M1']);

        $response = $this->actingAs($user)->patchJson(
            route('notifications.markAsRead', $notification)
        );

        $response->assertOk()->assertJson(['unread_count' => 0]);
        $this->assertTrue((bool) $notification->fresh()->est_lu);
    }

    public function test_mark_all_as_read_clears_unread(): void
    {
        $user = User::factory()->create();
        Notification::create(['user_id' => $user->id, 'titre' => 'T1', 'message' => 'M1']);
        Notification::create(['user_id' => $user->id, 'titre' => 'T2', 'message' => 'M2']);

        $response = $this->actingAs($user)->patchJson(route('notifications.markAllAsRead'));

        $response->assertOk()->assertJson(['unread_count' => 0]);
        $this->assertSame(0, Notification::where('user_id', $user->id)->where('est_lu', false)->count());
    }
}
