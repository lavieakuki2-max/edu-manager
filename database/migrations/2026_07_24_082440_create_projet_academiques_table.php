<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projets_academiques', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->enum('type', ['Stage', 'Memoire']);
            $table->string('annee_academique');
            $table->enum('statut_actuel', ['Sujet Soumis', 'En Cours', 'Prêt pour Soutenance', 'Validé'])->default('Sujet Soumis');
            $table->foreignId('etudiant_id')->constrained('etudiants')->onDelete('cascade');
            $table->foreignId('enseignant_id')->nullable()->constrained('enseignants')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projets_academiques');
    }
};
