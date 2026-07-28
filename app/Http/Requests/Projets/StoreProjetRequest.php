<?php

namespace App\Http\Requests\Projets;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'etudiant' && $this->user()->etudiant !== null;
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'in:Stage,Memoire'],
            'annee_academique' => ['required', 'string', 'max:20'],
            'theme_recherche' => ['nullable', 'required_if:type,Memoire', 'string', 'max:255'],
            'mots_cles' => ['nullable', 'string', 'max:255'],
            'entreprise_id' => ['nullable', 'required_if:type,Stage', 'exists:entreprises,id'],
            'date_debut' => ['nullable', 'required_if:type,Stage', 'date'],
            'date_fin' => ['nullable', 'required_if:type,Stage', 'date', 'after_or_equal:date_debut'],
            'objectifs_stage' => ['nullable', 'required_if:type,Stage', 'string'],
        ];
    }
}
