# Script de correction des 3 fichiers verrouilles
# Executer avec: powershell -ExecutionPolicy Bypass -File fix-locked-files.ps1

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$base = "D:\ProjetTutoreL2\edumanager1"

# ============================================
# 1. ProjetAcademiquePolicy.php (avec comment())
# ============================================
$policy = @'
<?php

namespace App\Policies;

use App\Models\ProjetAcademique;
use App\Models\User;

class ProjetAcademiquePolicy
{
    public function view(User $user, ProjetAcademique $projet): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'etudiant') {
            return $user->etudiant?->id === $projet->etudiant_id;
        }

        return $user->enseignant?->id === $projet->enseignant_id;
    }

    public function update(User $user, ProjetAcademique $projet): bool
    {
        return $user->role === 'admin' || $user->enseignant?->id === $projet->enseignant_id;
    }

    public function submit(User $user): bool
    {
        return $user->role === 'etudiant' && $user->etudiant !== null;
    }

    public function assign(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function comment(User $user, ProjetAcademique $projet): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'etudiant') {
            return $user->etudiant?->id === $projet->etudiant_id;
        }

        return $user->enseignant?->id === $projet->enseignant_id;
    }
}
'@

# ============================================
# 2. lettre-stage.blade.php (design officiel)
# ============================================
$lettre = @'
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Lettre de recommandation de stage</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.7; color: #1a1a1a; margin: 0; padding: 0; }
        .page { padding: 50px 60px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #0f766e; padding-bottom: 20px; }
        .header .university { font-size: 14px; font-weight: bold; color: #0f766e; letter-spacing: 2px; text-transform: uppercase; }
        .header .dept { font-size: 11px; color: #555; margin-top: 4px; }
        .header .title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 16px; color: #0f172a; letter-spacing: 1px; }
        .ref { font-size: 10px; color: #666; margin-bottom: 20px; }
        .dest { margin-bottom: 24px; }
        .dest strong { color: #0f766e; }
        .body p { margin: 10px 0; text-align: justify; }
        .body .highlight { background: #f0fdfa; border-left: 3px solid #0f766e; padding: 10px 14px; margin: 14px 0; border-radius: 4px; }
        .body .highlight strong { color: #0f766e; }
        .details-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .details-table td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        .details-table td:first-child { font-weight: bold; color: #475569; width: 35%; }
        .signature { margin-top: 60px; text-align: right; }
        .signature .line { border-top: 1px solid #333; width: 200px; margin-left: auto; margin-bottom: 4px; }
        .signature .name { font-weight: bold; font-size: 11px; }
        .signature .role { font-size: 10px; color: #666; }
        .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="university">Universite Adventiste de Lukanga</div>
            <div class="dept">Bureau des Stages et Memoires</div>
            <div class="title">Lettre de Recommandation de Stage</div>
        </div>
        <div class="ref">
            Ref: UNILUK/STAGE/{{ $projet->id }}/{{ now()->format('Y') }}
            &nbsp;&nbsp;|&nbsp;&nbsp; Lukanga, le {{ now()->format('d/m/Y') }}
        </div>
        <div class="dest">
            <p><strong>A la direction de :</strong></p>
            <p style="margin-left: 20px;">
                {{ $projet->stage?->entreprise?->raison_sociale ?? 'Entreprise d accueil' }}<br>
                @if($projet->stage?->entreprise?->adresse){{ $projet->stage->entreprise->adresse }}<br>@endif
                @if($projet->stage?->entreprise?->telephone)Tel : {{ $projet->stage->entreprise->telephone }}@endif
            </p>
        </div>
        <div class="body">
            <p>Madame, Monsieur,</p>
            <p>J ai l honneur de vous recommander l etudiant(e) ci-dessous pour effectuer un stage academique au sein de votre institution, dans le cadre de sa formation a l Universite Adventiste de Lukanga (UNILUK).</p>
            <div class="highlight">
                <strong>Etudiant(e) :</strong> {{ $projet->etudiant->user->prenom }} {{ $projet->etudiant->user->nom }}<br>
                <strong>Matricule :</strong> {{ $projet->etudiant->matricule }}<br>
                <strong>Classe :</strong> {{ $projet->etudiant->classe }} — {{ $projet->etudiant->filiere }}
            </div>
            <table class="details-table">
                <tr><td>Sujet du stage</td><td>{{ $projet->titre }}</td></tr>
                <tr><td>Description</td><td>{{ $projet->description }}</td></tr>
                @if($projet->stage)
                <tr><td>Periode</td><td>Du {{ \Carbon\Carbon::parse($projet->stage->date_debut)->format('d/m/Y') }} au {{ \Carbon\Carbon::parse($projet->stage->date_fin)->format('d/m/Y') }}</td></tr>
                <tr><td>Objectifs</td><td>{{ $projet->stage->objectifs_stage }}</td></tr>
                @endif
                <tr><td>Encadreur</td><td>{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }} ({{ $projet->enseignant?->grade ?? 'Enseignant' }})</td></tr>
                <tr><td>Annee academique</td><td>{{ $projet->annee_academique }}</td></tr>
            </table>
            <p>Nous vous prions de bien vouloir accueillir cet(te) etudiant(e) et de lui fournir les conditions necessaires a la realisation de son stage.</p>
            <p>Nous vous remercions par avance de votre collaboration et vous prions d agreer, Madame, Monsieur, l expression de nos salutations distinguees.</p>
        </div>
        <div class="signature">
            <div class="line"></div>
            <div class="name">Bureau des Stages</div>
            <div class="role">Universite Adventiste de Lukanga</div>
        </div>
        <div class="footer">UNILUK — Document genere le {{ now()->format('d/m/Y a H:i') }}</div>
    </div>
</body>
</html>
'@

# ============================================
# 3. fiche-cotation.blade.php (design complet)
# ============================================
$fiche = @'
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Fiche de cotation</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.5; color: #1a1a1a; margin: 0; padding: 0; }
        .page { padding: 40px 50px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0f766e; padding-bottom: 16px; }
        .header .university { font-size: 13px; font-weight: bold; color: #0f766e; text-transform: uppercase; letter-spacing: 2px; }
        .header .title { font-size: 15px; font-weight: bold; text-transform: uppercase; margin-top: 12px; color: #0f172a; }
        .info-grid { display: flex; gap: 20px; margin-bottom: 20px; }
        .info-box { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; }
        .info-box .label { font-size: 9px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; }
        .info-box .value { font-size: 12px; font-weight: bold; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 11px; }
        th { background: #f1f5f9; font-weight: bold; color: #334155; }
        .total-row th { background: #0f766e; color: white; font-size: 13px; }
        .note-cell { text-align: center; width: 80px; }
        .grade-scale { margin-top: 16px; font-size: 10px; color: #64748b; }
        .grade-scale strong { color: #334155; }
        .signature-area { margin-top: 40px; display: flex; justify-content: space-between; }
        .sig-block { text-align: center; width: 200px; }
        .sig-block .line { border-top: 1px solid #333; margin-bottom: 4px; }
        .sig-block .name { font-weight: bold; font-size: 10px; }
        .sig-block .role { font-size: 9px; color: #666; }
        .footer { margin-top: 30px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="university">Universite Adventiste de Lukanga</div>
            <div class="title">Fiche de Cotation — Soutenance</div>
        </div>
        <div class="info-grid">
            <div class="info-box">
                <div class="label">Etudiant</div>
                <div class="value">{{ $projet->etudiant->user->prenom }} {{ $projet->etudiant->user->nom }}</div>
                <div style="font-size:10px;color:#64748b;margin-top:2px">{{ $projet->etudiant->matricule }} — {{ $projet->etudiant->classe }} {{ $projet->etudiant->filiere }}</div>
            </div>
            <div class="info-box">
                <div class="label">Projet</div>
                <div class="value">{{ $projet->titre }}</div>
                <div style="font-size:10px;color:#64748b;margin-top:2px">{{ $projet->type }} — {{ $projet->annee_academique }}</div>
            </div>
            <div class="info-box">
                <div class="label">Encadreur</div>
                <div class="value">{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</div>
                <div style="font-size:10px;color:#64748b;margin-top:2px">{{ $projet->enseignant?->grade ?? 'Enseignant' }}</div>
            </div>
        </div>
        @if($projet->soutenance)
        <div class="info-grid">
            <div class="info-box">
                <div class="label">Date de soutenance</div>
                <div class="value">{{ \Carbon\Carbon::parse($projet->soutenance->date_soutenance)->format('d/m/Y') }}</div>
            </div>
            <div class="info-box">
                <div class="label">Salle</div>
                <div class="value">{{ $projet->soutenance->salle }}</div>
            </div>
        </div>
        @endif
        <table>
            <thead>
                <tr>
                    <th style="width:45%">Critere d evaluation</th>
                    <th class="note-cell">Note</th>
                    <th style="width:40%">Observations</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Qualite du document</strong><br><span style="font-size:9px;color:#64748b">Clarte, structure, respect des normes</span></td>
                    <td class="note-cell">/ 6</td>
                    <td></td>
                </tr>
                <tr>
                    <td><strong>Methodologie</strong><br><span style="font-size:9px;color:#64748b">Approche, rigueur, analyse</span></td>
                    <td class="note-cell">/ 5</td>
                    <td></td>
                </tr>
                <tr>
                    <td><strong>Presentation orale</strong><br><span style="font-size:9px;color:#64748b">Clarte, support, gestion du temps</span></td>
                    <td class="note-cell">/ 5</td>
                    <td></td>
                </tr>
                <tr>
                    <td><strong>Reponses aux questions</strong><br><span style="font-size:9px;color:#64748b">Maitrise du sujet, pertinence</span></td>
                    <td class="note-cell">/ 4</td>
                    <td></td>
                </tr>
                <tr class="total-row">
                    <th>TOTAL</th>
                    <th class="note-cell" style="font-size:14px">{{ $projet->soutenance?->note_finale ?? '___' }} / 20</th>
                    <th></th>
                </tr>
            </tbody>
        </table>
        <div class="grade-scale">
            <strong>Bareme :</strong> 0-5 insuffisant | 6-10 passable | 11-14 bien | 15-17 tres bien | 18-20 excellent
        </div>
        <div class="signature-area">
            <div class="sig-block">
                <div class="line"></div>
                <div class="name">Encadreur</div>
                <div class="role">{{ $projet->enseignant?->user?->prenom }} {{ $projet->enseignant?->user?->nom }}</div>
            </div>
            <div class="sig-block">
                <div class="line"></div>
                <div class="name">President du jury</div>
                <div class="role">UNILUK</div>
            </div>
        </div>
        <div class="footer">UNILUK — Document genere le {{ now()->format('d/m/Y a H:i') }}</div>
    </div>
</body>
</html>
'@

# ============================================
# ECRITURE DES FICHIERS
# ============================================
Write-Host "Ecriture des fichiers..."

[System.IO.File]::WriteAllText("$base\app\Policies\ProjetAcademiquePolicy.php", $policy, $utf8NoBom)
Write-Host "  [OK] ProjetAcademiquePolicy.php"

[System.IO.File]::WriteAllText("$base\resources\views\pdf\lettre-stage.blade.php", $lettre, $utf8NoBom)
Write-Host "  [OK] lettre-stage.blade.php"

[System.IO.File]::WriteAllText("$base\resources\views\pdf\fiche-cotation.blade.php", $fiche, $utf8NoBom)
Write-Host "  [OK] fiche-cotation.blade.php"

# Nettoyage du .ready.php
Remove-Item "$base\app\Policies\ProjetAcademiquePolicy.ready.php" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Termine ! Les 3 fichiers ont ete mis a jour."
Write-Host "Tu peux rouvrir VS Code maintenant."