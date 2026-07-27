<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Fiche de cotation</title>
    <style>body{font-family:DejaVu Sans,sans-serif;font-size:13px}.header{text-align:center;margin-bottom:24px}.title{text-transform:uppercase;font-weight:bold;font-size:18px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #333;padding:8px;text-align:left}</style>
</head>
<body>
    <div class="header">
        <div>Université Adventiste de Lukanga - UNILUK</div>
        <div class="title">Fiche de cotation</div>
    </div>
    <p><strong>Étudiant :</strong> {{ $projet->etudiant->user->prenom }} {{ $projet->etudiant->user->nom }}</p>
    <p><strong>Projet :</strong> {{ $projet->titre }}</p>
    <p><strong>Encadreur :</strong> {{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</p>
    <table>
        <tr><th>Critère</th><th>Note</th><th>Observation</th></tr>
        <tr><td>Qualité du document</td><td>/6</td><td></td></tr>
        <tr><td>Méthodologie</td><td>/5</td><td></td></tr>
        <tr><td>Présentation orale</td><td>/5</td><td></td></tr>
        <tr><td>Réponses aux questions</td><td>/4</td><td></td></tr>
        <tr><th>Total</th><th>{{ $projet->soutenance?->note_finale ?? '' }}/20</th><th></th></tr>
    </table>
</body>
</html>
