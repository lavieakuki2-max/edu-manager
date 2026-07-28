<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('soutenances', function (Blueprint $table) {
            $table->time('heure_debut')->nullable()->after('date_soutenance');
            $table->time('heure_fin')->nullable()->after('heure_debut');
            $table->foreignId('president_id')->nullable()->constrained('enseignants')->nullOnDelete()->after('salle');
            $table->foreignId('rapporteur_id')->nullable()->constrained('enseignants')->nullOnDelete()->after('president_id');
            $table->foreignId('membre_id')->nullable()->constrained('enseignants')->nullOnDelete()->after('rapporteur_id');
            $table->string('mention')->nullable()->after('note_finale');
            $table->text('remarques')->nullable()->after('mention');
            $table->string('statut')->default('planifiee')->after('remarques');
        });
    }

    public function down(): void
    {
        Schema::table('soutenances', function (Blueprint $table) {
            $table->dropForeign(['president_id']);
            $table->dropForeign(['rapporteur_id']);
            $table->dropForeign(['membre_id']);
            $table->dropColumn(['heure_debut', 'heure_fin', 'president_id', 'rapporteur_id', 'membre_id', 'mention', 'remarques', 'statut']);
        });
    }
};
