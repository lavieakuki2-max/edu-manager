@extends('pdf.layouts.header')
@section('title', 'Répartition des Projets par Enseignant')
@section('subtitle', 'Année académique ' . ($annee ?? '2025-2026'))
@section('content')
@foreach($enseignants as $i => $enseignant)
@if($i > 0)
<div style="page-break-before: always;"></div>
@endif
<div class="section-title">{{ $enseignant->user?->prenom }} {{ $enseignant->user?->nom }} @if($enseignant->grade)({{ $enseignant->grade }})@endif</div>
<div style="font-size:10px;color:#64748b;margin-bottom:6px;">Spécialité : {{ $enseignant->specialite ?? '—' }} · Charge : {{ $enseignant->projets_encadres->count() }} projet(s)</div>
@if($enseignant->projets_encadres->count() > 0)
<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Étudiant</th>
            <th>Matricule</th>
            <th>Titre du projet</th>
            <th>Type</th>
            <th>Statut</th>
        </tr>
    </thead>
    <tbody>
        @foreach($enseignant->projets_encadres as $j => $projet)
        <tr>
            <td>{{ $j + 1 }}</td>
            <td>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }}</td>
            <td>{{ $projet->etudiant?->matricule ?? '—' }}</td>
            <td><strong>{{ $projet->titre }}</strong></td>
            <td><span class="badge b-purple">{{ $projet->type }}</span></td>
            <td>
                @if($projet->statut_actuel === 'Validé')
                    <span class="badge b-green">{{ $projet->statut_actuel }}</span>
                @elseif($projet->statut_actuel === 'En Cours')
                    <span class="badge b-blue">{{ $projet->statut_actuel }}</span>
                @elseif($projet->statut_actuel === 'Sujet Soumis')
                    <span class="badge b-amber">{{ $projet->statut_actuel }}</span>
                @else
                    <span class="badge b-red">{{ $projet->statut_actuel }}</span>
                @endif
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@else
<p style="font-size:10px;color:#999;text-align:center;padding:12px;">Aucun projet encadré pour cette année.</p>
@endif
@endforeach
<div style="margin-top:20px;font-size:10px;color:#64748b;">
    Total : <strong>{{ $enseignants->sum(fn($e) => $e->projets_encadres->count()) }}</strong> projet(s) répartis entre <strong>{{ $enseignants->count() }}</strong> enseignant(s).
</div>
@endsection
