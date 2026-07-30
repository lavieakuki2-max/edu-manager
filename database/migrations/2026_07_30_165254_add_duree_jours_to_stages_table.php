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
            if (!Schema::hasColumn('stages', 'duree_jours')) {
                $table->unsignedInteger('duree_jours')->nullable()->after('date_fin');
            }
        });
    }

    public function down(): void
    {
        Schema::table('stages', function (Blueprint $table) {
            if (Schema::hasColumn('stages', 'duree_jours')) {
                $table->dropColumn('duree_jours');
            }
        });
    }
};
