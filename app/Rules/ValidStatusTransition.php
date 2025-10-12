<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidStatusTransition implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $allowed = ['pending', 'in_progress', 'done', 'canceled'];
        if (! in_array($value, $allowed, true)) {
            $fail(__('validation.invalid'));
        }
    }
}
