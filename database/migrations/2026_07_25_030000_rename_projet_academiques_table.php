<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('projet_academiques') && ! Schema::hasTable('projets_academiques')) {
            Schema::rename('projet_academiques', 'projets_academiques');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('projets_academiques') && ! Schema::hasTable('projet_academiques')) {
            Schema::rename('projets_academiques', 'projet_academiques');
        }
    }
};
