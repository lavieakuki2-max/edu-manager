<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Enseignant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EnseignantSeeder extends Seeder
{
    public function run(): void
    {
        $enseignants = [
            ['nom' => 'Mavungu', 'prenom' => 'Daniel', 'email' => 'daniel.mavungu@uniluk.edu', 'grade' => 'Professeur', 'specialite' => 'Genie logiciel'],
            ['nom' => 'Kambale', 'prenom' => 'Esther', 'email' => 'esther.kambale@uniluk.edu', 'grade' => 'Chef de travaux', 'specialite' => 'Reseaux et systemes'],
            ['nom' => 'Lubamba', 'prenom' => 'Patrick', 'email' => 'patrick.lubamba@uniluk.edu', 'grade' => 'Professeur', 'specialite' => 'Base de donnees'],
            ['nom' => 'Nzanzu', 'prenom' => 'Marie', 'email' => 'marie.nzanzu@uniluk.edu', 'grade' => 'Assistant', 'specialite' => 'Intelligence artificielle'],
        ];

        foreach ($enseignants as $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'password' => Hash::make('password'),
                'role' => 'enseignant',
            ]);

            Enseignant::updateOrCreate(['user_id' => $user->id], [
                'grade' => $data['grade'],
                'specialite' => $data['specialite'],
            ]);
        }
    }
}
