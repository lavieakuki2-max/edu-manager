<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@uniluk.edu'], [
            'nom' => 'Bureau',
            'prenom' => 'Stages',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $this->call([
            EnseignantSeeder::class,
            EntrepriseSeeder::class,
            EtudiantSeeder::class,
            ProjetSeeder::class,
        ]);
    }
}