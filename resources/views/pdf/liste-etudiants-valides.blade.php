@extends('pdf.layouts.header')
@section('title', 'Liste des Étudiants et Sujets Validés')
@section('subtitle', 'Année académique ' . ($annee ?? '2025-2026'))
@section('content')
<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Matricule</th>
            <th>Nom & Prénom</th>
            <th>Titre du projet</th>
            <th>Type</th>
            <th>Encadreur</th>
        </tr>
    </thead>
    <tbody>
        @foreach($projets as $i => $projet)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $projet->etudiant?->matricule ?? '—' }}</td>
            <td>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }}</td>
            <td><strong>{{ $projet->titre }}</strong></td>
            <td><span class="badge b-purple">{{ $projet->type }}</span></td>
            <td>{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</td>
        </tr>
        @endforeach
        @if($projets->isEmpty())
        <tr><td colspan="6" style="text-align:center;color:#999;padding:20px;">Aucun projet validé pour cette année.</td></tr>
        @endif
    </tbody>
</table>
<div style="margin-top:12px;font-size:10px;color:#64748b;">
    Total : <strong>{{ $projets->count() }}</strong> projet(s) validé(s)
</div>
@endsection
