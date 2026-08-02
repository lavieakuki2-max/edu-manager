<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('groupe')->default('general');
            $table->string('type')->default('text');
            $table->timestamps();
        });

        $defaults = [
            ['key' => 'universite_nom', 'value' => 'Université Adventiste de Lukanga', 'groupe' => 'identite', 'type' => 'text'],
            ['key' => 'universite_sigle', 'value' => 'UNILUK', 'groupe' => 'identite', 'type' => 'text'],
            ['key' => 'universite_logo', 'value' => null, 'groupe' => 'identite', 'type' => 'logo'],
            ['key' => 'faculte', 'value' => 'Faculté des Sciences et Technologies', 'groupe' => 'identite', 'type' => 'text'],
            ['key' => 'ministere_tutelle', 'value' => 'Ministère de l’Enseignement Supérieur et Universitaire', 'groupe' => 'identite', 'type' => 'text'],
            ['key' => 'pays', 'value' => 'République Démocratique du Congo', 'groupe' => 'identite', 'type' => 'text'],
            ['key' => 'ville', 'value' => 'Lukanga', 'groupe' => 'identite', 'type' => 'text'],
            ['key' => 'devise', 'value' => 'La science au service de l’homme', 'groupe' => 'identite', 'type' => 'text'],
            ['key' => 'annee_academique_active', 'value' => null, 'groupe' => 'annee', 'type' => 'text'],
            ['key' => 'annee_execution', 'value' => null, 'groupe' => 'annee', 'type' => 'text'],
        ];

        DB::table('settings')->insert($defaults);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
