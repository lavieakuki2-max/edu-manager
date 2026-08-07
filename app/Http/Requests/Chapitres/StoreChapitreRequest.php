<?php

namespace App\Http\Requests\Chapitres;

use Illuminate\Foundation\Http\FormRequest;

class StoreChapitreRequest extends FormRequest
{
    public function authorize(): bool
    {
        $projet = $this->route('projet');

        if ($this->user()->role === 'admin') {
            return true;
        }

        return $this->user()->role === 'enseignant'
            && $projet->enseignant_id === $this->user()->enseignant?->id;
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
        ];
    }
}
