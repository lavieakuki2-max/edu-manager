<?php

namespace App\Http\Requests\Projets;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()->role, ['admin', 'enseignant', 'etudiant'], true);
    }

    public function rules(): array
    {
        return [
            'statut_actuel' => [
                'required',
                'in:Sujet Soumis,En Cours,Prêt pour Soutenance,Validé,À Corriger',
            ],
            'commentaire' => ['nullable', 'string', 'max:500'],
        ];
    }
}
