<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Rapport global — Projets academiques</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0; }
        .page { padding: 40px 50px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0f766e; padding-bottom: 16px; }
        .header .university { font-size: 14px; font-weight: bold; color: #0f766e; text-transform: uppercase; letter-spacing: 2px; }
        .header .title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 10px; color: #0f172a; }
        .header .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
        .stats-grid { display: flex; gap: 12px; margin-bottom: 24px; }
        .stat-box { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; }
        .stat-box .value { font-size: 22px; font-weight: bold; color: #0f766e; }
        .stat-box .label { font-size: 9px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; page-break-inside: avoid; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 10px; }
        th { background: #f1f5f9; font-weight: bold; color: #334155; }
        .section-title { font-size: 13px; font-weight: bold; color: #0f766e; margin-top: 24px; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
        .badge { display: inline-block; padding: 1px 6px; border-radius: 10px; font-size: 9px; font-weight: bold; }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-amber { background: #fef3c7; color: #92400e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-purple { background: #ede9fe; color: #5b21b6; }
        .footer { margin-top: 30px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="university">{{ institution()['nom'] }}</div>
            <div class="title">Rapport Global — Projets Academiques</div>
            <div class="subtitle">Annee academique {{ $annee ?? '2025-2026' }} — Genere le {{ now()->format('d/m/Y a H:i') }}</div>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="value">{{ $stats['total'] }}</div>
                <div class="label">Total projets</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['soumis'] }}</div>
                <div class="label">Sujets soumis</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['en_cours'] }}</div>
                <div class="label">En cours</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['soutenances'] }}</div>
                <div class="label">Prets soutenance</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['valides'] }}</div>
                <div class="label">Valides</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['a_corriger'] }}</div>
                <div class="label">A corriger</div>
            </div>
        </div>

        <div class="section-title">Liste des projets</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Etudiant</th>
                    <th>Encadreur</th>
                    <th>Statut</th>
                    <th>Soutenance</th>
                </tr>
            </thead>
            <tbody>
                @foreach($projets as $i => $projet)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td><strong>{{ $projet->titre }}</strong></td>
                    <td>{{ $projet->type }}</td>
                    <td>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }}</td>
                    <td>{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</td>
                    <td>
                        @if($projet->statut_actuel === 'Validé')
                            <span class="badge badge-green">{{ $projet->statut_actuel }}</span>
                        @elseif($projet->statut_actuel === 'En Cours')
                            <span class="badge badge-blue">{{ $projet->statut_actuel }}</span>
                        @elseif($projet->statut_actuel === 'Sujet Soumis')
                            <span class="badge badge-amber">{{ $projet->statut_actuel }}</span>
                        @elseif($projet->statut_actuel === 'À Corriger')
                            <span class="badge badge-red">{{ $projet->statut_actuel }}</span>
                        @else
                            <span class="badge badge-purple">{{ $projet->statut_actuel }}</span>
                        @endif
                    </td>
                    <td>
                        @if($projet->soutenance)
                            {{ \Carbon\Carbon::parse($projet->soutenance->date_soutenance)->format('d/m/Y') }}
                            @if($projet->soutenance->note_finale)
                                — <strong>{{ $projet->soutenance->note_finale }}/20</strong>
                            @endif
                        @else
                            —
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @if($stats['total_stages'] > 0 || $stats['total_memoires'] > 0)
        <div class="section-title">Repartition par type</div>
        <div class="stats-grid">
            <div class="stat-box">
                <div class="value">{{ $stats['total_stages'] }}</div>
                <div class="label">Stages</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['total_memoires'] }}</div>
                <div class="label">Memoires</div>
            </div>
        </div>
        @endif

        <div class="footer">
            {{ institution()['sigle'] }} — {{ institution()['nom'] }} — Bureau des Stages et Memoires — Document officiel
        </div>
    </div>
</body>
</html>
