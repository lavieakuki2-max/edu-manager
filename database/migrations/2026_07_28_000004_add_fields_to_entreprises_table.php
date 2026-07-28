<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('entreprises', function (Blueprint $table) {
            if (!Schema::hasColumn('entreprises', 'email')) {
                $table->string('email')->nullable()->after('telephone');
            }
            if (!Schema::hasColumn('entreprises', 'secteur')) {
                $table->string('secteur')->nullable()->after('email');
            }
            if (!Schema::hasColumn('entreprises', 'maitre_stage_telephone')) {
                $table->string('maitre_stage_telephone')->nullable()->after('maitre_stage');
            }
            if (!Schema::hasColumn('entreprises', 'maitre_stage_email')) {
                $table->string('maitre_stage_email')->nullable()->after('maitre_stage_telephone');
            }
        });
    }

    public function down(): void
    {
        Schema::table('entreprises', function (Blueprint $table) {
            $drop = [];
            if (Schema::hasColumn('entreprises', 'email')) $drop[] = 'email';
            if (Schema::hasColumn('entreprises', 'secteur')) $drop[] = 'secteur';
            if (Schema::hasColumn('entreprises', 'maitre_stage_telephone')) $drop[] = 'maitre_stage_telephone';
            if (Schema::hasColumn('entreprises', 'maitre_stage_email')) $drop[] = 'maitre_stage_email';
            if (!empty($drop)) $table->dropColumn($drop);
        });
    }
};
