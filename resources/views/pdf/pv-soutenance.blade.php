@extends('pdf.layouts.header')
@php $soutenance = $projet->soutenance; @endphp
@section('title', 'Procès-Verbal de Soutenance')
@section('subtitle', $projet->titre . ' — ' . ($annee ?? '2025-2026'))
@section('content')
<div class="content">
    <p style="text-align:right;font-size:10px;color:#64748b;">Goma, le {{ $soutenance ? \Carbon\Carbon::parse($soutenance->date_soutenance)->format('d/m/Y') : now()->format('d/m/Y') }}</p>
    <br>
    <p>L'an <strong>{{ date('Y') }}</strong>, le jury de soutenance de l'Université Adventiste de Lukanga, Faculté des Sciences et Technologies, s'est réuni pour évaluer le travail de :</p>
    <br>
    <dl>
        <dt>Étudiant(e)</dt>
        <dd><strong>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }}</strong></dd>
        <dt>Matricule</dt>
        <dd>{{ $projet->etudiant?->matricule ?? '—' }}</dd>
        <dt>Intitulé du projet</dt>
        <dd><strong>{{ $projet->titre }}</strong></dd>
        <dt>Type</dt>
        <dd>{{ $projet->type }}</dd>
        <dt>Encadreur</dt>
        <dd>{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</dd>
    </dl>
    <br>
    <p><strong>Composition du jury :</strong></p>
    <dl>
        <dt>Président</dt>
        <dd>{{ $soutenance?->president?->user?->prenom }} {{ $soutenance?->president?->user?->nom }} {{ $soutenance?->president?->grade ? '(' . $soutenance->president->grade . ')' : '' }}</dd>
        <dt>Rapporteur</dt>
        <dd>{{ $soutenance?->rapporteur?->user?->prenom }} {{ $soutenance?->rapporteur?->user?->nom }} {{ $soutenance?->rapporteur?->grade ? '(' . $soutenance->rapporteur->grade . ')' : '' }}</dd>
        <dt>Membre</dt>
        <dd>{{ $soutenance?->membre?->user?->prenom }} {{ $soutenance?->membre?->user?->nom }} {{ $soutenance?->membre?->grade ? '(' . $soutenance->membre->grade . ')' : '' }}</dd>
    </dl>
    <br>
    <p><strong>Déroulement :</strong></p>
    <dl>
        <dt>Date</dt>
        <dd>{{ $soutenance ? \Carbon\Carbon::parse($soutenance->date_soutenance)->format('d/m/Y') : '—' }}</dd>
        <dt>Horaire</dt>
        <dd>{{ $soutenance?->heure_debut ? \Carbon\Carbon::parse($soutenance->heure_debut)->format('H:i') : '—' }} @if($soutenance?->heure_fin) — {{ \Carbon\Carbon::parse($soutenance->heure_fin)->format('H:i') }} @endif</dd>
        <dt>Salle</dt>
        <dd>{{ $soutenance?->salle ?? '—' }}</dd>
    </dl>
    <br>
    @if($soutenance?->note_finale !== null)
    <p><strong>Résultat :</strong></p>
    <div style="text-align:center;padding:12px;border:2px solid #0f766e;border-radius:6px;margin:10px 0;">
        <span style="font-size:18px;font-weight:bold;color:#0f766e;">Note : {{ $soutenance->note_finale }}/20</span>
        @if($soutenance->mention)
        <br><span style="font-size:14px;color:#065f46;">Mention : {{ $soutenance->mention }}</span>
        @endif
    </div>
    @endif
    @if($soutenance?->remarques)
    <p><strong>Remarques du jury :</strong></p>
    <p style="font-style:italic;">"{{ $soutenance->remarques }}"</p>
    @endif
    <br>
    <div class="signature-block" style="display:flex;justify-content:space-between;">
        <div style="text-align:center;">
            <div class="signature-line">Le Président du Jury</div>
        </div>
        <div style="text-align:center;">
            <div class="signature-line">Le Rapporteur</div>
        </div>
        <div style="text-align:center;">
            <div class="signature-line">Le Membre</div>
        </div>
    </div>
</div>
@endsection
