<?php

namespace App\Http\Requests\Auth;

use App\Domain\Users\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoginRequest extends FormRequest
{
    protected ?User $user = null;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $this->user = User::where('email', $this->input('email'))->first();

            if (! $this->user) {
                $validator->errors()->add('email', __('auth.failed'));
            }
        });
    }

    public function getUser(): User
    {
        return $this->user;
    }
}
