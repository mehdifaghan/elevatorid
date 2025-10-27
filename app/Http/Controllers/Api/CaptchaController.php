<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CaptchaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CaptchaController extends Controller
{
    public function __construct(private readonly CaptchaService $captchaService)
    {
    }

    public function store(): JsonResponse
    {
        $captcha = $this->captchaService->generate();

        return response()->json([
            'captchaId' => $captcha['id'],
            'imageUrl' => $captcha['image'],
            'expiresIn' => $captcha['expires_in'],
        ]);
    }

    public function validateValue(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'captchaId' => ['required', 'string'],
            'captchaValue' => ['nullable', 'string'],
            'captcha' => ['nullable', 'string'],
        ]);

        $value = $validated['captchaValue'] ?? $validated['captcha'] ?? null;

        if ($value === null) {
            throw ValidationException::withMessages([
                'captchaValue' => ['Captcha value is required.'],
            ]);
        }

        $isValid = $this->captchaService->validate($validated['captchaId'], $value);

        return response()->json([
            'valid' => $isValid,
            'message' => $isValid ? 'Captcha is valid.' : 'Invalid captcha value.',
        ]);
    }
}
