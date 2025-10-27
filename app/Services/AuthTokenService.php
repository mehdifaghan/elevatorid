<?php

namespace App\Services;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Support\Str;

class AuthTokenService
{
    private const REFRESH_TTL_DAYS = 30;

    public function __construct(private readonly RefreshToken $refreshTokenModel)
    {
    }

    /**
     * Issue a Sanctum access token alongside a persistent refresh token.
     *
     * @return array{access_token: string, refresh_token: string, expires_in: int}
     */
    public function issue(User $user, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        $accessToken = $user->createToken('api', ['*']);

        $plainRefreshToken = Str::random(64);
        $hashedToken = $this->hash($plainRefreshToken);

        $this->refreshTokenModel->newQuery()->create([
            'user_id' => $user->id,
            'token' => $hashedToken,
            'expires_at' => now()->addDays(self::REFRESH_TTL_DAYS),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        return [
            'access_token' => $accessToken->plainTextToken,
            'refresh_token' => $plainRefreshToken,
            'expires_in' => $this->accessTokenTtlSeconds(),
        ];
    }

    /**
     * Rotate a refresh token and return a new token pair.
     *
     * @return array{access_token: string, refresh_token: string, expires_in: int}|null
     */
    public function rotate(string $refreshToken, ?string $ipAddress = null, ?string $userAgent = null): ?array
    {
        $hashedToken = $this->hash($refreshToken);

        /** @var RefreshToken|null $storedToken */
        $storedToken = $this->refreshTokenModel
            ->newQuery()
            ->where('token', $hashedToken)
            ->where('expires_at', '>', now())
            ->first();

        if (! $storedToken) {
            return null;
        }

        $user = $storedToken->user;

        if (! $user) {
            $storedToken->delete();

            return null;
        }

        $storedToken->forceFill([
            'last_used_at' => now(),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ])->save();

        // Rotate the refresh token
        $storedToken->delete();

        return $this->issue($user, $ipAddress, $userAgent);
    }

    public function revokeUserRefreshTokens(User $user): void
    {
        $this->refreshTokenModel->newQuery()->where('user_id', $user->id)->delete();
    }

    private function hash(string $token): string
    {
        return hash('sha256', $token);
    }

    private function accessTokenTtlSeconds(): int
    {
        $expirationMinutes = config('sanctum.expiration', 60);

        return (int) $expirationMinutes * 60;
    }
}
