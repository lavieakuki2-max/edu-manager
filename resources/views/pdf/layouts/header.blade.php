<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>@yield('title', 'Document officiel')</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0; }
        .page { padding: 30px 40px; }
        .letterhead { text-align: center; margin-bottom: 20px; border-bottom: 3px double #0f766e; padding-bottom: 12px; }
        .letterhead .rep { font-size: 9px; color: #64748b; letter-spacing: 1px; }
        .letterhead .univ { font-size: 15px; font-weight: bold; color: #0f766e; text-transform: uppercase; letter-spacing: 2px; }
        .letterhead .fac { font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 2px; }
        .letterhead .slogan { font-size: 9px; color: #64748b; margin-top: 2px; font-style: italic; }
        .letterhead .contact { font-size: 8px; color: #94a3b8; margin-top: 4px; }
        .ref-line { font-size: 9px; color: #64748b; margin-bottom: 20px; text-align: right; }
        .title { font-size: 14px; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 20px; color: #0f172a; }
        .subtitle { font-size: 10px; color: #64748b; text-align: center; margin-bottom: 20px; }
        .footer { margin-top: 30px; text-align: center; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        .footer strong { color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: avoid; }
        th, td { border: 1px solid #cbd5e1; padding: 5px 7px; text-align: left; font-size: 10px; }
        th { background: #f1f5f9; font-weight: bold; color: #334155; font-size: 9px; text-transform: uppercase; }
        .badge { display: inline-block; padding: 1px 5px; border-radius: 8px; font-size: 8px; font-weight: bold; }
        .b-green { background: #d1fae5; color: #065f46; }
        .b-blue { background: #dbeafe; color: #1e40af; }
        .b-amber { background: #fef3c7; color: #92400e; }
        .b-red { background: #fee2e2; color: #991b1b; }
        .b-purple { background: #ede9fe; color: #5b21b6; }
        .stats-grid { display: flex; gap: 10px; margin-bottom: 20px; }
        .stat-box { flex: 1; border: 1px solid #e2e8f0; border-radius: 5px; padding: 8px; text-align: center; }
        .stat-box .val { font-size: 20px; font-weight: bold; color: #0f766e; }
        .stat-box .lbl { font-size: 8px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-top: 2px; }
        .section-title { font-size: 12px; font-weight: bold; color: #0f766e; margin-top: 22px; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 3px; }
        .signature-block { margin-top: 40px; }
        .signature-line { display: inline-block; width: 200px; border-top: 1px solid #1a1a1a; margin-top: 50px; padding-top: 4px; font-size: 10px; text-align: center; }
        .content { font-size: 11px; line-height: 1.6; }
        .content p { margin: 6px 0; }
        dl { font-size: 10px; }
        dt { font-weight: bold; color: #334155; margin-top: 6px; }
        dd { margin-left: 12px; color: #1a1a1a; }
    </style>
</head>
<body>
    <div class="page">
        @include('pdf.partials.letterhead')
        <div class="ref-line">Réf. : {{ institution()['sigle'] }}/FAST/{{ date('Y') }}/{{ Str::upper(Str::random(4)) }}</div>
        <div class="title">@yield('title', 'Document officiel')</div>
        @hasSection('subtitle')
            <div class="subtitle">@yield('subtitle')</div>
        @endif
        @yield('content')
        <div class="footer">
            <strong>{{ institution()['sigle'] }}</strong> — {{ institution()['nom'] }} — {{ institution()['faculte'] }}<br>
            Bureau des Stages et Mémoires — Document officiel généré automatiquement le {{ now()->format('d/m/Y à H:i') }}
        </div>
    </div>
</body>
</html>
