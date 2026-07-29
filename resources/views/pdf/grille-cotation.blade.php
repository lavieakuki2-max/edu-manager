@extends('pdf.layouts.header')
@section('title', 'Grille de Cotation et d\'Évaluation de Soutenance')
@php
$soutenance = $projet->soutenance;
$criteres = [
    ['libelle' => 'Présentation et structure du travail', 'max' => 4, 'note' => $soutenance?->note_finale ? min(4, $soutenance->note_finale * 4 / 20) : null],
    ['libelle' => 'Méthodologie et démarche scientifique', 'max' => 4, 'note' => null],
    ['libelle' => 'Résultats et analyse critique', 'max' => 4, 'note' => null],
    ['libelle' => 'Qualité des réponses aux questions du jury', 'max' => 4, 'note' => null],
    ['libelle' => 'Maîtrise du sujet et pertinence des conclusions', 'max' => 4, 'note' => null],
];
$totalMax = 20;
$totalObtenu = $soutenance?->note_finale;
@endphp
@section('subtitle', 'Projet : ' . $projet->titre . ' — ' . ($annee ?? '2025-2026'))
@section('content')
<div class="content">
    <dl>
        <dt>Étudiant</dt>
        <dd>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }} ({{ $projet->etudiant?->matricule ?? '—' }})</dd>
        <dt>Type de projet</dt>
        <dd>{{ $projet->type }}</dd>
        <dt>Encadreur</dt>
        <dd>{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</dd>
        @if($soutenance)
        <dt>Date de soutenance</dt>
        <dd>{{ \Carbon\Carbon::parse($soutenance->date_soutenance)->format('d/m/Y') }}</dd>
        @endif
    </dl>
</div>

<table>
    <thead>
        <tr>
            <th style="width:50%;">Critère d'évaluation</th>
            <th style="width:15%;">Note max</th>
            <th style="width:20%;">Note attribuée</th>
            <th style="width:15%;">Observations</th>
        </tr>
    </thead>
    <tbody>
        @foreach($criteres as $c)
        <tr>
            <td>{{ $c['libelle'] }}</td>
            <td style="text-align:center;">{{ $c['max'] }}</td>
            <td style="text-align:center;">{{ $c['note'] !== null ? number_format($c['note'], 1) : '___' }}/{{ $c['max'] }}</td>
            <td style="font-size:9px;color:#999;">&nbsp;</td>
        </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr style="font-weight:bold;background:#f1f5f9;">
            <td style="text-align:right;">TOTAL</td>
            <td style="text-align:center;">{{ $totalMax }}</td>
            <td style="text-align:center;font-size:13px;">{{ $totalObtenu !== null ? $totalObtenu . '/20' : '___/20' }}</td>
            <td>&nbsp;</td>
        </tr>
        @if($soutenance?->mention)
        <tr style="font-weight:bold;background:#f1f5f9;">
            <td colspan="2" style="text-align:right;">Mention</td>
            <td colspan="2" style="text-align:center;font-size:12px;color:#0f766e;">{{ $soutenance->mention }}</td>
        </tr>
        @endif
    </tfoot>
</table>

<div style="margin-top:20px;font-size:10px;color:#64748b;">
    <p><strong>Appréciation générale :</strong> {{ $soutenance?->remarques ?? '—' }}</p>
</div>

<div class="signature-block" style="display:flex;justify-content:space-between;">
    <div style="text-align:center;">
        <div class="signature-line">Le Président du Jury</div>
    </div>
    <div style="text-align:center;">
        <div class="signature-line">Le Rapporteur</div>
    </div>
    <div style="text-align:center;">
        <div class="signature-line">L'Encadreur</div>
    </div>
</div>
@endsection
