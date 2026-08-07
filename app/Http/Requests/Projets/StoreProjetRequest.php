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
            'type' => ['required', 'in:Stage,Memoire,Projet_Tutore'],
            'annee_academique' => ['required', 'string', 'max:20'],
            'theme_recherche' => ['nullable', 'required_if:type,Memoire', 'string', 'max:255'],
            'mots_cles' => ['nullable', 'string', 'max:255'],
            'entreprise_id' => ['nullable', 'integer', 'exists:entreprises,id'],
            'nouvelle_entreprise' => ['nullable', 'string', 'max:255'],
            'nouvelle_entreprise_adresse' => ['nullable', 'string'],
            'nouvelle_entreprise_telephone' => ['nullable', 'string', 'max:50'],
            'nouvelle_entreprise_email' => ['nullable', 'email', 'max:255'],
            'nouvelle_entreprise_maitre_stage' => ['nullable', 'string', 'max:255'],
            'nouvelle_entreprise_maitre_stage_telephone' => ['nullable', 'string', 'max:50'],
            'nouvelle_entreprise_maitre_stage_email' => ['nullable', 'email', 'max:255'],
            'date_debut' => ['nullable', 'required_if:type,Stage', 'date'],
            'date_fin' => ['nullable', 'required_if:type,Stage', 'date', 'after_or_equal:date_debut'],
            'objectifs_stage' => ['nullable', 'required_if:type,Stage', 'string'],
        ];
    }

    public function withValidator(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        $validator->after(function ($validator) {
            if ($this->type === 'Stage' && ! $this->entreprise_id && ! $this->nouvelle_entreprise) {
                $validator->errors()->add(
                    'entreprise_id',
                    'Vous devez sélectionner une entreprise existante ou saisir une nouvelle entreprise.'
                );
            }
        });
    }
}
