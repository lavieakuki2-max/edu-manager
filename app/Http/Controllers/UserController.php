<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Etudiant;
use App\Models\Enseignant;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    // List all users with etudiant/enseignant profiles
    public function index(Request $request)
    {
        $query = User::with(['etudiant', 'enseignant']);

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'stats' => [
                'total' => User::count(),
                'etudiants' => User::where('role', 'etudiant')->count(),
                'enseignants' => User::where('role', 'enseignant')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'en_attente' => User::where('statut', 'en_attente')->count(),
            ],
        ]);
    }

    // Store new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => 'required|in:admin,enseignant,etudiant',
            // Etudiant fields
            'matricule' => 'required_if:role,etudiant|nullable|string|unique:etudiants,matricule',
            'classe' => 'required_if:role,etudiant|nullable|string',
            'filiere' => 'required_if:role,etudiant|nullable|string',
            // Enseignant fields
            'grade' => 'required_if:role,enseignant|nullable|string',
            'specialite' => 'required_if:role,enseignant|nullable|string',
        ]);

        $user = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        if ($validated['role'] === 'etudiant') {
            Etudiant::create([
                'user_id' => $user->id,
                'matricule' => $validated['matricule'],
                'classe' => $validated['classe'],
                'filiere' => $validated['filiere'],
            ]);
        } elseif ($validated['role'] === 'enseignant') {
            Enseignant::create([
                'user_id' => $user->id,
                'grade' => $validated['grade'] ?? '',
                'specialite' => $validated['specialite'] ?? '',
            ]);
        }

        return redirect()->route('admin.users.index')->with('success', 'Utilisateur créé avec succès.');
    }

    // Update user
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'statut' => 'nullable|in:actif,en_attente,rejete',
            'motif_rejet' => 'nullable|string|max:500',
        ]);

        $user->update($validated);

        if ($user->etudiant) {
            $user->etudiant->update($request->only(['matricule', 'classe', 'filiere']));
        }
        if ($user->enseignant) {
            $user->enseignant->update($request->only(['grade', 'specialite']));
        }

        return back()->with('success', 'Utilisateur mis à jour.');
    }

    // Confirm a pending account
    public function confirm(User $user)
    {
        $user->update(['statut' => 'actif', 'motif_rejet' => null]);

        NotificationService::notifierCompteConfirme($user);

        return back()->with('success', "Le compte de {$user->prenom} {$user->nom} a été confirmé.");
    }

    // Reject a pending account
    public function reject(Request $request, User $user)
    {
        $request->validate([
            'motif_rejet' => 'required|string|max:500',
        ]);

        $user->update(['statut' => 'rejete', 'motif_rejet' => $request->motif_rejet]);

        NotificationService::notifierCompteRejete($user, $request->motif_rejet);

        return back()->with('success', "La demande de {$user->prenom} {$user->nom} a été rejetée.");
    }

    // Delete user
    public function destroy(User $user)
    {
        // Delete associated profile
        if ($user->etudiant) $user->etudiant->delete();
        if ($user->enseignant) $user->enseignant->delete();
        $user->delete();

        return back()->with('success', 'Utilisateur supprimé.');
    }
}
