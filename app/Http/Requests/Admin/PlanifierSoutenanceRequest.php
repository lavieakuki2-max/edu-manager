<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PlanifierSoutenanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'date_soutenance' => ['required', 'date'],
            'salle' => ['required', 'string', 'max:255'],
            'note_finale' => ['nullable', 'numeric', 'between:0,20'],
        ];
    }
}
