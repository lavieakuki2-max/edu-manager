<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projets_academiques', function (Blueprint $table) {
            $table->string('statut_actuel')->default('Sujet Soumis')->change();
        });
    }

    public function down(): void
    {
        Schema::table('projets_academiques', function (Blueprint $table) {
            $table->enum('statut_actuel', ['Sujet Soumis', 'En Cours', 'Prêt pour Soutenance', 'Validé'])->default('Sujet Soumis')->change();
        });
    }
};
