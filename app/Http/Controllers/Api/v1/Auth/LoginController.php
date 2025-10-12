<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $this->ensureIsNotRateLimited($request->ip());

        $user = $request->getUser();

        if (! Hash::check($request->validated()['password'], $user->password)) {
            RateLimiter::hit($this->throttleKey($request->ip()));

            return response()->json([
                'message' => __('auth.failed'),
            ], Response::HTTP_UNAUTHORIZED);
        }

        RateLimiter::clear($this->throttleKey($request->ip()));

        $token = $user->createToken('api')->plainTextToken;
        $refreshToken = $user->tokens()->create([
            'name' => 'refresh',
            'abilities' => ['refresh-token'],
            'expires_at' => now()->addMinutes((int) config('sanctum.refresh_expiration', 60 * 24 * 30)),
        ]);

        return response()->json([
            'token' => $token,
            'refresh_token' => $refreshToken->plainTextToken ?? null,
            'user' => $user,
        ]);
    }

    protected function ensureIsNotRateLimited(string $ip): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey($ip), (int) env('RATE_LIMIT_AUTH', '30'))) {
            return;
        }

        abort(Response::HTTP_TOO_MANY_REQUESTS, __('auth.throttle'));
    }

    protected function throttleKey(string $ip): string
    {
        return Str::lower($ip.'|login');
    }
}
