<?php

namespace App\Http\Requests\Chapitres;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChapitreStatutRequest extends FormRequest
{
    public function authorize(): bool
    {
        $chapitre = $this->route('chapitre');

        if ($this->user()->role === 'admin') {
            return true;
        }

        return $this->user()->role === 'enseignant'
            && $chapitre->projet->enseignant_id === $this->user()->enseignant?->id;
    }

    public function rules(): array
    {
        return [
            'statut' => ['required', 'string', 'in:En Attente,En Cours,À Corriger,Validé'],
        ];
    }
}
