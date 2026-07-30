<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(30)
            ->get();

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('est_lu', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->update(['est_lu' => true]);

        $unreadCount = Notification::where('user_id', $request->user()->id)
            ->where('est_lu', false)
            ->count();

        return response()->json(['unread_count' => $unreadCount]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('est_lu', false)
            ->update(['est_lu' => true]);

        return response()->json(['unread_count' => 0]);
    }

    /**
     * Mark notification as read and redirect to its target URL safely.
     * Falls back to dashboard if the target URL is invalid or unreachable.
     */
    public function redirect(Request $request, Notification $notification): RedirectResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->update(['est_lu' => true]);

        $targetUrl = $notification->lien_url;

        if (!$targetUrl) {
            return redirect()->route('dashboard')
                ->with('info', 'Notification marquée comme lue.');
        }

        try {
            return redirect()->to($targetUrl);
        } catch (\Exception $e) {
            Log::warning('Échec de redirection depuis la notification', [
                'notification_id' => $notification->id,
                'lien_url' => $targetUrl,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('dashboard')
                ->with('info', 'La ressource liée n\'est plus disponible. Redirigé vers le tableau de bord.');
        }
    }
}
