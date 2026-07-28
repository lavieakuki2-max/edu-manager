<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projet_statut_historiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('projet_id')->constrained('projets_academiques')->cascadeOnDelete();
            $table->string('ancien_statut');
            $table->string('nouveau_statut');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projet_statut_historiques');
    }
};
