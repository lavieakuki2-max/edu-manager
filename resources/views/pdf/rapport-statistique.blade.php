<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Rapport Statistique — {{ $annee }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0; }
        .page { padding: 40px 50px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0f766e; padding-bottom: 16px; }
        .header .university { font-size: 14px; font-weight: bold; color: #0f766e; text-transform: uppercase; letter-spacing: 2px; }
        .header .title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 10px; color: #0f172a; }
        .header .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
        .stats-grid { display: flex; gap: 12px; margin-bottom: 24px; }
        .stat-box { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 8px; text-align: center; }
        .stat-box .value { font-size: 24px; font-weight: bold; color: #0f766e; }
        .stat-box .label { font-size: 9px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-top: 4px; }
        .section-title { font-size: 13px; font-weight: bold; color: #0f766e; margin-top: 28px; margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
        .progress-bar { background: #e2e8f0; border-radius: 8px; height: 14px; overflow: hidden; margin-top: 6px; }
        .progress-fill { background: #0f766e; height: 100%; border-radius: 8px; }
        .progress-label { font-size: 10px; color: #64748b; margin-top: 2px; }
        .bar-chart { display: flex; align-items: flex-end; gap: 16px; justify-content: center; margin-top: 12px; height: 120px; }
        .bar-item { text-align: center; }
        .bar { width: 50px; background: #0f766e; border-radius: 4px 4px 0 0; margin: 0 auto; }
        .bar-label { font-size: 8px; color: #64748b; margin-top: 4px; }
        .bar-value { font-size: 10px; font-weight: bold; color: #0f766e; margin-bottom: 2px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; page-break-inside: avoid; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 10px; }
        th { background: #f1f5f9; font-weight: bold; color: #334155; }
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
            <div class="title">Rapport Statistique Global</div>
            <div class="subtitle">Annee academique {{ $annee }} — Genere le {{ now()->format('d/m/Y à H:i') }}</div>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <div class="value">{{ $stats['total'] }}</div>
                <div class="label">Total projets</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['stages'] }}</div>
                <div class="label">Stages</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['memoires'] }}</div>
                <div class="label">Memoires</div>
            </div>
            <div class="stat-box">
                <div class="value">{{ $stats['taux_reussite'] }}%</div>
                <div class="label">Taux de reussite</div>
            </div>
        </div>

        <div class="section-title">Repartition par statut</div>
        <div class="stats-grid">
            <div class="stat-box">
                <div class="value" style="color: #92400e;">{{ $stats['soumis'] }}</div>
                <div class="label">Sujets soumis</div>
            </div>
            <div class="stat-box">
                <div class="value" style="color: #1e40af;">{{ $stats['en_cours'] }}</div>
                <div class="label">En cours</div>
            </div>
            <div class="stat-box">
                <div class="value" style="color: #065f46;">{{ $stats['valides'] }}</div>
                <div class="label">Valides</div>
            </div>
            <div class="stat-box">
                <div class="value" style="color: #991b1b;">{{ $stats['a_corriger'] }}</div>
                <div class="label">A corriger</div>
            </div>
        </div>

        @if($stats['total'] > 0)
        <div class="section-title">Taux de reussite</div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: {{ $stats['taux_reussite'] }}%"></div>
        </div>
        <div class="progress-label">{{ $stats['valides'] }} projet(s) valide(s) sur {{ $stats['total'] }} — {{ $stats['taux_reussite'] }}%</div>
        @endif

        <div class="section-title">Repartition visuelle</div>
        <div class="bar-chart">
            @php $max = max($stats['soumis'], $stats['en_cours'], $stats['valides'], $stats['a_corriger'], 1); @endphp
            <div class="bar-item">
                <div class="bar-value">{{ $stats['soumis'] }}</div>
                <div class="bar" style="height: {{ ($stats['soumis'] / $max) * 100 }}px; background: #f59e0b;"></div>
                <div class="bar-label">Soumis</div>
            </div>
            <div class="bar-item">
                <div class="bar-value">{{ $stats['en_cours'] }}</div>
                <div class="bar" style="height: {{ ($stats['en_cours'] / $max) * 100 }}px; background: #3b82f6;"></div>
                <div class="bar-label">En cours</div>
            </div>
            <div class="bar-item">
                <div class="bar-value">{{ $stats['valides'] }}</div>
                <div class="bar" style="height: {{ ($stats['valides'] / $max) * 100 }}px; background: #10b981;"></div>
                <div class="bar-label">Valides</div>
            </div>
            <div class="bar-item">
                <div class="bar-value">{{ $stats['a_corriger'] }}</div>
                <div class="bar" style="height: {{ ($stats['a_corriger'] / $max) * 100 }}px; background: #ef4444;"></div>
                <div class="bar-label">A corriger</div>
            </div>
        </div>

        <div class="section-title">Details des projets</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Etudiant</th>
                    <th>Encadreur</th>
                    <th>Statut</th>
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
                </tr>
                @endforeach
                @if($projets->isEmpty())
                <tr>
                    <td colspan="6" style="text-align: center; color: #999; padding: 20px;">Aucun projet enregistre pour cette annee.</td>
                </tr>
                @endif
            </tbody>
        </table>

        <div class="footer">
            {{ institution()['sigle'] }} — {{ institution()['nom'] }} — Bureau des Stages et Memoires — Document officiel genere automatiquement
        </div>
    </div>
</body>
</html>
