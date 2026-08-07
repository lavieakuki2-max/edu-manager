<?php

namespace App\Http\Requests\Projets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommentaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        $projet = $this->route('projet');

        if ($this->user()->role === 'admin') {
            return true;
        }

        if ($this->user()->role === 'etudiant') {
            return $this->user()->etudiant?->id === $projet->etudiant_id;
        }

        return $this->user()->enseignant?->id === $projet->enseignant_id;
    }

    public function rules(): array
    {
        return [
            'contenu' => ['required', 'string', 'max:2000'],
            'document_id' => [
                'nullable',
                'integer',
                Rule::exists('documents', 'id')->where(fn ($q) => $q->where('projet_id', $this->route('projet')->id)),
            ],
        ];
    }
}
