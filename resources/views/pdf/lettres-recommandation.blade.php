@extends('pdf.layouts.header')
@section('title', 'Lettres de Recommandation de Stage')
@section('subtitle', 'Année académique ' . ($annee ?? '2025-2026'))
@section('content')
@forelse($projets as $i => $projet)
<div style="page-break-after: always; {{ $loop->last ? 'page-break-after: auto;' : '' }}">
    <div class="content">
        <p style="text-align:right;font-size:10px;color:#64748b;">Goma, le {{ now()->format('d/m/Y') }}</p>
        <p><strong>Objet : Lettre de recommandation pour stage académique</strong></p>
        <br>
        <p>Je soussigné, <strong>Chef de Division des Stages et Mémoires</strong> de l'Université Adventiste de Lukanga (UNILUK), atteste que l'étudiant(e) :</p>
        <br>
        <dl>
            <dt>Nom et Prénom</dt>
            <dd>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }}</dd>
            <dt>Matricule</dt>
            <dd>{{ $projet->etudiant?->matricule ?? '—' }}</dd>
            <dt>Faculté</dt>
            <dd>Faculté des Sciences et Technologies</dd>
            <dt>Année académique</dt>
            <dd>{{ $annee }}</dd>
            <dt>Sujet de stage</dt>
            <dd><strong>{{ $projet->titre }}</strong></dd>
            <dt>Entreprise d'accueil</dt>
            <dd>{{ $projet->stage?->entreprise?->raison_sociale ?? $projet->entreprise?->raison_sociale ?? '—' }}</dd>
            <dt>Période de stage</dt>
            <dd>du {{ $projet->stage?->date_debut ? \Carbon\Carbon::parse($projet->stage->date_debut)->format('d/m/Y') : '—' }} au {{ $projet->stage?->date_fin ? \Carbon\Carbon::parse($projet->stage->date_fin)->format('d/m/Y') : '—' }}</dd>
        </dl>
        <br>
        <p>est régulièrement inscrit(e) à l'Université Adventiste de Lukanga et a été retenu(e) pour effectuer un stage académique dans le cadre de sa formation.</p>
        <p>Nous recommandons vivement cet(te) étudiant(e) pour l'accomplissement de son stage et vous serions reconnaissants de l'accueil que vous voudrez bien lui réserver.</p>
        <p>Ce document est délivré pour servir et valoir ce que de droit.</p>
        <br>
        <div class="signature-block" style="text-align:right;">
            <div class="signature-line">Chef de Division des Stages et Mémoires</div>
        </div>
    </div>
</div>
@empty
<div class="content">
    <p style="text-align:center;color:#999;">Aucun stage validé pour cette année académique.</p>
</div>
@endforelse
@endsection
