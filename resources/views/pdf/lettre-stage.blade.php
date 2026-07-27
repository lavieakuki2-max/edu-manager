<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Lettre de recommandation de stage</title>
    <style>body{font-family:DejaVu Sans,sans-serif;font-size:13px;line-height:1.6}.header{text-align:center;margin-bottom:32px}.title{text-transform:uppercase;font-weight:bold;font-size:18px}.signature{margin-top:60px;text-align:right}</style>
</head>
<body>
    <div class="header">
        <div>Université Adventiste de Lukanga - UNILUK</div>
        <div class="title">Lettre de recommandation de stage</div>
    </div>
    <p>À la direction de {{ $projet->stage?->entreprise?->raison_sociale ?? 'l entreprise d accueil' }},</p>
    <p>Nous recommandons l étudiant(e) {{ $projet->etudiant->user->prenom }} {{ $projet->etudiant->user->nom }}, matricule {{ $projet->etudiant->matricule }}, pour effectuer un stage académique dans votre institution.</p>
    <p>Le stage portera sur : <strong>{{ $projet->titre }}</strong>.</p>
    <p>Encadreur académique : {{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}.</p>
    <div class="signature">Fait à Lukanga, le {{ now()->format('d/m/Y') }}<br>Bureau des stages</div>
</body>
</html>
