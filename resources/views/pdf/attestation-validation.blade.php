@extends('pdf.layouts.header')
@section('title', 'Attestation de Validation de Projet')
@section('subtitle', 'Quitus de Soutenance — ' . ($annee ?? '2025-2026'))
@section('content')
<div class="content">
    <p style="text-align:right;font-size:10px;color:#64748b;">Goma, le {{ now()->format('d/m/Y') }}</p>
    <br>
    <p><strong>Objet : Attestation de validation de projet académique</strong></p>
    <br>
    <p>Je soussigné, <strong>Chef de Division des Stages et Mémoires</strong> de l'Université Adventiste de Lukanga (UNILUK), atteste que :</p>
    <br>
    <dl>
        <dt>Étudiant(e)</dt>
        <dd><strong>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }}</strong></dd>
        <dt>Matricule</dt>
        <dd>{{ $projet->etudiant?->matricule ?? '—' }}</dd>
        <dt>Faculté</dt>
        <dd>Faculté des Sciences et Technologies</dd>
        <dt>Année académique</dt>
        <dd>{{ $annee }}</dd>
        <dt>Projet</dt>
        <dd><strong>{{ $projet->titre }}</strong></dd>
        <dt>Type</dt>
        <dd>{{ $projet->type }}</dd>
        <dt>Encadreur</dt>
        <dd>{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</dd>
        @if($projet->statut_actuel === 'Validé')
        <dt>Statut</dt>
        <dd><span class="badge b-green">Validé</span></dd>
        @if($projet->soutenance?->note_finale)
        <dt>Note finale</dt>
        <dd><strong>{{ $projet->soutenance->note_finale }}/20</strong> — {{ $projet->soutenance->mention ?? '—' }}</dd>
        @endif
        @endif
    </dl>
    <br>
    <p>a validé son projet académique et est autorisé(e) à soutenir / a soutenu avec succès son travail devant le jury compétent.</p>
    <p>La présente attestation est délivrée pour servir et valoir ce que de droit.</p>
    <br>
    <div class="signature-block" style="text-align:right;">
        <div class="signature-line">Chef de Division des Stages et Mémoires</div>
    </div>
</div>
@endsection
