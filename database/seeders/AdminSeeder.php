<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrNew(['email' => 'admin@uniluk.edu']);

        $admin->nom = 'Bureau';
        $admin->prenom = 'Stages';
        $admin->role = 'admin';
        $admin->statut = 'actif';

        // Le mot de passe n'est réinitialisé que si le compte est nouveau
        // ou s'il utilise encore le mot de passe par défaut. Ainsi, un admin
        // qui a déjà changé son mot de passe ne sera pas re-forcé au redémarrage.
        $stillUsesDefault = ! $admin->exists || Hash::check('password', $admin->password ?? '');

        if ($stillUsesDefault) {
            $admin->password = Hash::make(env('ADMIN_PASSWORD') ?: 'password');
            $admin->must_change_password = true;
        }

        $admin->save();
    }
}
