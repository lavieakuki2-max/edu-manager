<?php

namespace Database\Seeders;

use App\Models\Entreprise;
use Illuminate\Database\Seeder;

class EntrepriseSeeder extends Seeder
{
    public function run(): void
    {
        $entreprises = [
            ['raison_sociale' => 'Clinique Adventiste de Lukanga', 'adresse' => 'Lukanga, Nord-Kivu', 'telephone' => '+243 990 000 001', 'maitre_stage' => 'Ir. Patient Kitsa'],
            ['raison_sociale' => 'Societe Nationale d\'Electricite (SNEL)', 'adresse' => 'Avenue du 30 Juin, Kinshasa', 'telephone' => '+243 990 000 002', 'maitre_stage' => 'Ir. Jean-Pierre Mugisha'],
            ['raison_sociale' => 'Bank Congo SA', 'adresse' => 'Boulevard du 30 Juin, Goma', 'telephone' => '+243 990 000 003', 'maitre_stage' => 'Mme. Claudine Bahati'],
            ['raison_sociale' => 'Ministere de l\'Enseignement Superieur', 'adresse' => 'Avenue de la Paix, Goma', 'telephone' => '+243 990 000 004', 'maitre_stage' => 'Dr. Emmanuel Sumbiri'],
        ];

        foreach ($entreprises as $data) {
            Entreprise::updateOrCreate(['raison_sociale' => $data['raison_sociale']], $data);
        }
    }
}
