<?php

namespace App\Http\Requests\Projets;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $projet = $this->route('projet');

        return $this->user()->role === 'etudiant'
            && $this->user()->etudiant?->id === $projet->etudiant_id;
    }

    public function rules(): array
    {
        return [
            'fichier' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }
}
