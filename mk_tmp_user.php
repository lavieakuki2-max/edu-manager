<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Etudiant;
use Illuminate\Support\Facades\Hash;

$email = 'sup.tmp.' . time() . '@uniluk.edu';
$user = User::create([
    'nom' => 'Tmp', 'prenom' => 'Sup', 'email' => $email,
    'password' => Hash::make('password123'), 'role' => 'etudiant',
    'statut' => 'actif', 'email_verified_at' => now(),
]);
Etudiant::create([
    'user_id' => $user->id, 'matricule' => 'TMP' . time(),
    'classe' => 'L2', 'filiere' => 'Informatique',
]);
echo $user->id;
