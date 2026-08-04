<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use App\Models\Etudiant;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:etudiant,enseignant'],
            'matricule' => ['required_if:role,etudiant', 'nullable', 'string', 'max:50', 'unique:etudiants,matricule'],
            'classe' => ['required_if:role,etudiant', 'nullable', 'string', 'max:50'],
            'filiere' => ['required_if:role,etudiant', 'nullable', 'string', 'max:100'],
            'grade' => ['required_if:role,enseignant', 'nullable', 'string', 'max:100'],
            'specialite' => ['required_if:role,enseignant', 'nullable', 'string', 'max:100'],
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'statut' => 'en_attente',
            'email_verified_at' => now(),
        ]);

        if ($request->role === 'etudiant') {
            Etudiant::create([
                'user_id' => $user->id,
                'matricule' => $request->matricule,
                'classe' => $request->classe,
                'filiere' => $request->filiere,
            ]);
        } elseif ($request->role === 'enseignant') {
            Enseignant::create([
                'user_id' => $user->id,
                'grade' => $request->grade,
                'specialite' => $request->specialite,
            ]);
        }

        NotificationService::notifierInscriptionEnAttente($user);

        return redirect()->route('login')->with(
            'status',
            'Votre compte a été créé. Il doit être confirmé par l\'administrateur avant de pouvoir vous connecter.'
        );
    }
}
