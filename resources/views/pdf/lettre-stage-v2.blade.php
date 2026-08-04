<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Lettre de recommandation de stage</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; line-height: 1.55; color: #1a1a1a; }
        .page { padding: 30px 38px; }

        .letterhead { text-align: center; margin-bottom: 16px; border-bottom: 3px double #0f766e; padding-bottom: 12px; }
        .letterhead .logo { height: 62px; margin-bottom: 6px; }
        .letterhead .rep { font-size: 8.5px; color: #64748b; letter-spacing: 1px; }
        .letterhead .univ { font-size: 15px; font-weight: bold; color: #0f766e; text-transform: uppercase; letter-spacing: 2px; }
        .letterhead .fac { font-size: 11.5px; font-weight: bold; color: #0f172a; margin-top: 2px; }
        .letterhead .slogan { font-size: 9px; color: #64748b; margin-top: 2px; font-style: italic; }
        .letterhead .annee { font-size: 8px; color: #94a3b8; margin-top: 4px; }

        .ref-line { font-size: 9px; color: #64748b; margin-top: 12px; }
        .date-line { text-align: right; font-size: 10.5px; color: #1a1a1a; margin-top: 6px; }

        .addressee { margin-top: 20px; font-size: 10.5px; }
        .addressee .attn { text-transform: uppercase; font-weight: bold; color: #0f172a; letter-spacing: 0.5px; }
        .addressee .societe { font-weight: bold; margin-top: 2px; }
        .addressee .adresse { color: #475569; margin-top: 1px; }

        .objet { margin-top: 18px; }
        .objet .label { font-weight: bold; text-decoration: underline; text-transform: uppercase; }
        .objet .content { font-weight: bold; }

        .salutation { margin-top: 14px; }

        .body p { margin: 7px 0; text-align: justify; }

        .info-block { margin: 12px 0; border: 1px solid #e2e8f0; border-left: 3px solid #0f766e; background: #f8fafc; border-radius: 4px; padding: 10px 14px; }
        .info-block .info-title { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f766e; margin-bottom: 6px; }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 3px 6px; vertical-align: top; font-size: 10.5px; }
        .info-table td.key { width: 33%; color: #64748b; }
        .info-table td.val { font-weight: bold; color: #0f172a; }

        .closing { margin-top: 14px; }

        .signature-block { margin-top: 46px; text-align: right; }
        .signature-block .role { font-weight: bold; color: #0f172a; }
        .signature-block .dept { font-size: 9px; color: #64748b; margin-top: 2px; }

        .footer { margin-top: 34px; text-align: center; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        .footer strong { color: #64748b; }
    </style>
</head>
<body>
    <div class="page">
        @php
            $inst = institution();
            $etudiant = $projet->etudiant;
            $enseignant = $projet->enseignant;
            $stage = $projet->stage;
            $entreprise = $stage?->entreprise;
            $prenom = $etudiant?->user?->prenom;
            $nom = $etudiant?->user?->nom;
            $matricule = $etudiant?->matricule ?? '—';
            $fmt = fn ($d) => $d ? \Carbon\Carbon::parse($d)->format('d/m/Y') : '—';
            $classe = $etudiant?->classe ?: '—';
            $filiere = $etudiant?->filiere ?: '—';
            $grade = $enseignant?->grade ? trim($enseignant->grade) . ' ' : '';
            $encadreur = $enseignant?->user?->prenom && $enseignant?->user?->nom
                ? $grade . $enseignant->user->prenom . ' ' . $enseignant->user->nom
                : '—';
        @endphp

        @include('pdf.partials.letterhead')

        <div class="ref-line">Réf. : {{ $inst['sigle'] }}/FAST/{{ date('Y') }}/{{ strtoupper(Str::random(4)) }}</div>
        <div class="date-line">{{ $inst['ville'] ?: 'Goma' }}, le {{ now()->format('d/m/Y') }}</div>

        <div class="addressee">
            <div class="attn">À la Direction de</div>
            <div class="societe">{{ $entreprise?->raison_sociale ?? "L'entreprise d'accueil" }}</div>
            @if($entreprise?->adresse)
                <div class="adresse">{{ $entreprise->adresse }}{{ $entreprise->telephone ? ' — Tél. : ' . $entreprise->telephone : '' }}</div>
            @elseif($entreprise?->telephone)
                <div class="adresse">Tél. : {{ $entreprise->telephone }}</div>
            @endif
        </div>

        <div class="objet">
            <span class="label">Objet : </span>
            <span class="content">Recommandation de l'étudiant(e) {{ $prenom }} {{ strtoupper($nom ?? '') }} pour un stage académique</span>
        </div>

        <div class="salutation">Madame, Monsieur,</div>

        <div class="body">
            <p>
                Nous avons l'honneur de recommander à votre aimable attention l'étudiant(e)
                <strong>{{ $prenom }} {{ $nom }}</strong>, titulaire de la matricule
                <strong>{{ $matricule }}</strong>, régulièrement inscrit(e) pour l'année académique
                <strong>{{ $projet->annee_academique ?: $inst['annee_academique'] }}</strong>.
            </p>

            <div class="info-block">
                <div class="info-title">Informations sur l'étudiant(e)</div>
                <table class="info-table">
                    <tr><td class="key">Nom et prénom</td><td class="val">{{ $prenom }} {{ $nom }}</td></tr>
                    <tr><td class="key">Matricule</td><td class="val">{{ $matricule }}</td></tr>
                    <tr><td class="key">Faculté</td><td class="val">{{ $inst['faculte'] ?: '—' }}</td></tr>
                    <tr><td class="key">Classe</td><td class="val">{{ $classe }}</td></tr>
                    <tr><td class="key">Filière</td><td class="val">{{ $filiere }}</td></tr>
                    <tr><td class="key">Année académique</td><td class="val">{{ $projet->annee_academique ?: $inst['annee_academique'] }}</td></tr>
                </table>
            </div>

            <p>
                Dans le cadre de sa formation, cet(te) étudiant(e) doit effectuer un stage académique portant sur :
                <strong>« {{ $projet->titre }} »</strong>.
            </p>

            @if($projet->description)
                <p>{{ $projet->description }}</p>
            @endif

            <div class="info-block">
                <div class="info-title">Détails du stage</div>
                <table class="info-table">
                    <tr><td class="key">Entreprise d'accueil</td><td class="val">{{ $entreprise?->raison_sociale ?? '—' }}</td></tr>
                    <tr><td class="key">Thème du stage</td><td class="val">{{ $projet->titre }}</td></tr>
                    <tr><td class="key">Période</td><td class="val">du {{ $fmt($stage?->date_debut) }} au {{ $fmt($stage?->date_fin) }}</td></tr>
                    <tr><td class="key">Durée</td><td class="val">{{ $stage?->duree_jours ? $stage->duree_jours . ' jours' : '—' }}</td></tr>
                    <tr><td class="key">Encadreur académique</td><td class="val">{{ $encadreur }}</td></tr>
                    @if($entreprise?->maitre_stage)
                        <tr><td class="key">Maître de stage</td><td class="val">{{ $entreprise->maitre_stage }}</td></tr>
                    @endif
                </table>
            </div>

            <p>
                Nous vous prions de bien vouloir accueillir favorablement la candidature de cet(te) étudiant(e) au sein de
                vos services et de mettre à sa disposition les conditions nécessaires à la réalisation de son stage.
                Nous vous garantissons son assiduité, sa rigueur et la qualité de son travail.
            </p>

            <p>
                Ce document est délivré pour servir et valoir ce que de droit.
            </p>

            <p class="closing">
                Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.
            </p>
        </div>

        <div class="signature-block">
            <div class="role">Le Chef de Division des Stages et Mémoires</div>
            <div class="dept">{{ $inst['nom'] }} — {{ $inst['sigle'] }}</div>
        </div>

        <div class="footer">
            <strong>{{ $inst['sigle'] }}</strong> — {{ $inst['nom'] }} — {{ $inst['faculte'] }}<br>
            Bureau des Stages et Mémoires — Document officiel généré automatiquement le {{ now()->format('d/m/Y à H:i') }}
        </div>
    </div>
</body>
</html>
