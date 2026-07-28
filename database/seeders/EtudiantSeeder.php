<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Etudiant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EtudiantSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = [
            ['nom' => 'Kasereka', 'prenom' => 'Jean', 'email' => 'jean.kasereka@uniluk.edu', 'matricule' => 'UNILUK-L2-001', 'classe' => 'L2', 'filiere' => 'Informatique'],
            ['nom' => 'Amani', 'prenom' => 'Grace', 'email' => 'grace.amani@uniluk.edu', 'matricule' => 'UNILUK-L2-002', 'classe' => 'L2', 'filiere' => 'Informatique'],
            ['nom' => 'Safari', 'prenom' => 'Moise', 'email' => 'moise.safari@uniluk.edu', 'matricule' => 'UNILUK-L2-003', 'classe' => 'L2', 'filiere' => 'Gestion'],
            ['nom' => 'Bashizi', 'prenom' => 'Patrick', 'email' => 'patrick.bashizi@uniluk.edu', 'matricule' => 'UNILUK-L3-001', 'classe' => 'L3', 'filiere' => 'Informatique'],
            ['nom' => 'Nzirhu', 'prenom' => 'Clementine', 'email' => 'clementine.nzirhu@uniluk.edu', 'matricule' => 'UNILUK-L3-002', 'classe' => 'L3', 'filiere' => 'Informatique'],
            ['nom' => 'Muhindo', 'prenom' => 'Samuel', 'email' => 'samuel.muhindo@uniluk.edu', 'matricule' => 'UNILUK-L3-003', 'classe' => 'L3', 'filiere' => 'Gestion'],
            ['nom' => 'Kavira', 'prenom' => 'Dorcas', 'email' => 'dorcas.kavira@uniluk.edu', 'matricule' => 'UNILUK-L2-004', 'classe' => 'L2', 'filiere' => 'Gestion'],
            ['nom' => 'Mubalama', 'prenom' => 'Isaac', 'email' => 'isaac.mubalama@uniluk.edu', 'matricule' => 'UNILUK-L3-004', 'classe' => 'L3', 'filiere' => 'Informatique'],
        ];

        foreach ($etudiants as $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'password' => Hash::make('password'),
                'role' => 'etudiant',
            ]);

            Etudiant::updateOrCreate(['user_id' => $user->id], [
                'matricule' => $data['matricule'],
                'classe' => $data['classe'],
                'filiere' => $data['filiere'],
            ]);
        }
    }
}
