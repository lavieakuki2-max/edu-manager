<?php

namespace App\Http\Requests\Projets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $projet = $this->route('projet');

        if ($this->user()->role === 'etudiant') {
            return $this->user()->etudiant?->id === $projet->etudiant_id;
        }

        if ($this->user()->role === 'enseignant') {
            return $this->user()->enseignant?->id === $projet->enseignant_id;
        }

        return false;
    }

    public function rules(): array
    {
        return [
            'fichier' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'chapitre_id' => [
                'nullable',
                'integer',
                Rule::exists('chapitres', 'id')->where(fn ($q) => $q->where('projet_id', $this->route('projet')->id)),
            ],
        ];
    }
}
