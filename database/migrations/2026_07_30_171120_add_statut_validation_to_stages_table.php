<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stages', function (Blueprint $table) {
            if (!Schema::hasColumn('stages', 'statut_validation')) {
                $table->string('statut_validation', 20)->default('en_attente')->after('statut');
            }
        });
    }

    public function down(): void
    {
        Schema::table('stages', function (Blueprint $table) {
            if (Schema::hasColumn('stages', 'statut_validation')) {
                $table->dropColumn('statut_validation');
            }
        });
    }
};
