<?php

namespace App\Console\Commands;

use App\Models\Stage;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SyncStageDurations extends Command
{
    protected $signature = 'stages:sync-durations';
    protected $description = 'Recalcule et stocke duree_jours pour tous les stages existants';

    public function handle(): int
    {
        $stages = Stage::whereNotNull('date_debut')->whereNotNull('date_fin')->get();
        $bar = $this->output->createProgressBar($stages->count());
        $bar->start();

        foreach ($stages as $stage) {
            $stage->duree_jours = Carbon::parse($stage->date_debut)
                ->diffInDays(Carbon::parse($stage->date_fin)) + 1;
            $stage->saveQuietly();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("{$stages->count()} stage(s) synchronisé(s).");

        return Command::SUCCESS;
    }
}
