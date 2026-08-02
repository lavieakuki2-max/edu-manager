<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Lettre de recommandation de stage</title>
    <style>body{font-family:DejaVu Sans,sans-serif;font-size:13px;line-height:1.6}.header{text-align:center;margin-bottom:32px}.title{text-transform:uppercase;font-weight:bold;font-size:18px}.signature{margin-top:60px;text-align:right}</style>
</head>
<body>
    @include('pdf.partials.letterhead')
    <div class="header" style="margin-top: 20px;">
        <div class="title">Lettre de recommandation de stage</div>
    </div>
    <p>A la direction de {{ $projet->stage?->entreprise?->raison_sociale ?? "l entreprise d accueil" }},</p>
    <p>Nous recommandons l etudiant(e) {{ $projet->etudiant->user->prenom }} {{ $projet->etudiant->user->nom }}, matricule {{ $projet->etudiant->matricule }}, pour effectuer un stage academique dans votre institution.</p>
    <p>Le stage portera sur : <strong>{{ $projet->titre }}</strong>.</p>
    <p>Periode de stage : du <strong>{{ $projet->stage?->date_debut ? \Carbon\Carbon::parse($projet->stage->date_debut)->format("d/m/Y") : "—" }}</strong> au <strong>{{ $projet->stage?->date_fin ? \Carbon\Carbon::parse($projet->stage->date_fin)->format("d/m/Y") : "—" }}</strong> ({{ $projet->stage?->duree_jours ?? "—" }} jours).</p>
    <p>Encadreur academique : {{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}.</p>
    <div class="signature">Fait à {{ institution()['ville'] }}, le {{ now()->format("d/m/Y") }}<br>Bureau des stages</div>
</body>
</html>