@extends('pdf.layouts.header')
@section('title', 'Annuaire des Entreprises Partenaires')
@section('subtitle', 'Année académique ' . ($annee ?? '2025-2026'))
@section('content')
<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Raison sociale</th>
            <th>Secteur</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Maître de stage</th>
            <th>Stages</th>
        </tr>
    </thead>
    <tbody>
        @foreach($entreprises as $i => $entreprise)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td><strong>{{ $entreprise->raison_sociale }}</strong></td>
            <td>{{ $entreprise->secteur ?? '—' }}</td>
            <td>{{ $entreprise->adresse ?? '—' }}</td>
            <td>{{ $entreprise->telephone ?? '—' }}</td>
            <td>{{ $entreprise->email ?? '—' }}</td>
            <td>{{ $entreprise->maitre_stage ?? '—' }}</td>
            <td style="text-align:center;">{{ $entreprise->stages_count ?? 0 }}</td>
        </tr>
        @endforeach
        @if($entreprises->isEmpty())
        <tr><td colspan="8" style="text-align:center;color:#999;padding:20px;">Aucune entreprise enregistrée.</td></tr>
        @endif
    </tbody>
</table>
<div style="margin-top:12px;font-size:10px;color:#64748b;">
    Total : <strong>{{ $entreprises->count() }}</strong> entreprise(s) partenaire(s)
</div>
@endsection
