<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use App\Models\Document;
use App\Models\ProjetStatutHistorique;
use App\Models\Soutenance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EtudiantController extends Controller
{
    public function discussions(Request $request)
    {
        $etudiant = $request->user()->etudiant;
        $projets = \App\Models\ProjetAcademique::where('etudiant_id', $etudiant?->id)->pluck('id');

        $commentaires = Commentaire::whereIn('projet_id', $projets)
            ->with(['projet', 'auteur'])
            ->latest()
            ->get();

        $projetsList = \App\Models\ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->with(['enseignant.user'])
            ->get();

        return Inertia::render('Etudiant/Discussions', [
            'commentaires' => $commentaires,
            'projets' => $projetsList,
        ]);
    }

    public function maSoutenance(Request $request)
    {
        $etudiant = $request->user()->etudiant;
        $projet = \App\Models\ProjetAcademique::where('etudiant_id', $etudiant?->id)
            ->with(['soutenance.president.user', 'soutenance.rapporteur.user', 'soutenance.membre.user', 'enseignant.user'])
            ->first();

        $soutenance = $projet?->soutenance ?? null;
        $soutenance?->load(['president.user', 'rapporteur.user', 'membre.user']);

        return Inertia::render('Etudiant/MaSoutenance', [
            'projet' => $projet,
            'soutenance' => $soutenance,
        ]);
    }
}
