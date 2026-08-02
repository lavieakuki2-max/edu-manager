@extends("pdf.layouts.header")
@section("title", "Attestation de Validation de Projet")
@section("subtitle", "Quitus de Soutenance — " . ($annee ?? "2025-2026"))
@section("content")
<div class="content">
    <p style="text-align:right;font-size:10px;color:#64748b;">{{ institution()['ville'] }}, le {{ now()->format("d/m/Y") }}</p>
    <br>
    <p><strong>Objet : Attestation de validation de projet academique</strong></p>
    <br>
    <p>Je soussigne, <strong>Chef de Division des Stages et Memoires</strong> de l'{{ institution()['nom'] }} ({{ institution()['sigle'] }}), atteste que :</p>
    <br>
    <dl>
        <dt>Etudiant(e)</dt>
        <dd><strong>{{ $projet->etudiant?->user?->prenom }} {{ $projet->etudiant?->user?->nom }}</strong></dd>
        <dt>Matricule</dt>
        <dd>{{ $projet->etudiant?->matricule ?? "—" }}</dd>
        <dt>Faculte</dt>
        <dd>{{ institution()['faculte'] }}</dd>
        <dt>Annee academique</dt>
        <dd>{{ $annee }}</dd>
        <dt>Projet</dt>
        <dd><strong>{{ $projet->titre }}</strong></dd>
        <dt>Type</dt>
        <dd>{{ $projet->type }}</dd>
        <dt>Encadreur</dt>
        <dd>{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</dd>
        @if($projet->type === "Stage" && $projet->stage)
        <dt>Periode de stage</dt>
        <dd>du {{ $projet->stage?->date_debut ? \Carbon\Carbon::parse($projet->stage->date_debut)->format("d/m/Y") : "—" }} au {{ $projet->stage?->date_fin ? \Carbon\Carbon::parse($projet->stage->date_fin)->format("d/m/Y") : "—" }} ({{ $projet->stage->duree_jours ?? "—" }} jours)</dd>
        @endif
        @if($projet->statut_actuel === "Valide")
        <dt>Statut</dt>
        <dd><span class="badge b-green">Valide</span></dd>
        @if($projet->soutenance?->note_finale)
        <dt>Note finale</dt>
        <dd><strong>{{ $projet->soutenance->note_finale }}/20</strong> — {{ $projet->soutenance->mention ?? "—" }}</dd>
        @endif
        @endif
    </dl>
    <br>
    <p>a valide son projet academique et est autorise(e) a soutenir / a soutenu avec succes son travail devant le jury competent.</p>
    <p>La presente attestation est delivree pour servir et valoir ce que de droit.</p>
    <br>
    <div class="signature-block" style="text-align:right;">
        <div class="signature-line">Chef de Division des Stages et Memoires</div>
    </div>
</div>
@endsection