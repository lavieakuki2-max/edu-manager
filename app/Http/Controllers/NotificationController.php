<?php

namespace App\Http\Controllers;

use App\Models\ProjetStatutHistorique;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = ProjetStatutHistorique::with(['projet', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->filter(function ($n) use ($user) {
                if ($user->role === 'admin') return true;
                if ($user->role === 'enseignant') {
                    return $n->projet?->enseignant_id === $user->enseignant?->id;
                }
                return $n->projet?->etudiant_id === $user->etudiant?->id;
            })
            ->values();

        return response()->json($notifications);
    }
}
