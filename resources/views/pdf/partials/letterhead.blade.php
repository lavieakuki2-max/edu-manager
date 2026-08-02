@php
    $inst = institution();
    $logoPath = $inst['logo'] ? public_path('storage/' . $inst['logo']) : null;
    $logoExists = $logoPath && file_exists($logoPath);
@endphp
<div class="letterhead">
    @if($logoExists)
        <img class="logo" src="{{ $logoPath }}" alt="Logo">
    @endif
    <div class="letterhead-text">
        <div class="ministere">{{ $inst['ministere_tutelle'] ?: '' }}</div>
        <div class="universite">{{ $inst['nom'] }}@if($inst['sigle']) — <span class="sigle">{{ $inst['sigle'] }}</span>@endif</div>
        <div class="faculte">{{ $inst['faculte'] ?: '' }}</div>
        <div class="devise">{{ $inst['devise'] ?: '' }}</div>
        <div class="annee">Année académique {{ $inst['annee_academique'] }} · Année d'exécution {{ $inst['annee_execution'] }}</div>
    </div>
</div>
