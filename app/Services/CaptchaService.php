<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CaptchaService
{
    private const CACHE_PREFIX = 'captcha:';
    private const LIFETIME_SECONDS = 180;

    /**
     * Generate a captcha code alongside a base64 encoded image.
     *
     * @return array{id: string, image: string, expires_in: int}
     */
    public function generate(): array
    {
        $code = (string) random_int(1000, 9999);
        $captchaId = (string) Str::uuid();

        Cache::put(
            $this->cacheKey($captchaId),
            $code,
            now()->addSeconds(self::LIFETIME_SECONDS)
        );

        return [
            'id' => $captchaId,
            'image' => $this->buildImage($code),
            'expires_in' => self::LIFETIME_SECONDS,
        ];
    }

    /**
     * Validate a captcha value.
     */
    public function validate(string $captchaId, string $value, bool $consume = true): bool
    {
        $cached = Cache::get($this->cacheKey($captchaId));

        if (! $cached) {
            return false;
        }

        $isValid = hash_equals($cached, $value);

        if ($isValid && $consume) {
            Cache::forget($this->cacheKey($captchaId));
        }

        return $isValid;
    }

    private function cacheKey(string $captchaId): string
    {
        return self::CACHE_PREFIX.$captchaId;
    }

    private function buildImage(string $code): string
    {
        if (! function_exists('imagecreatetruecolor')) {
            return 'data:text/plain;base64,'.base64_encode($code);
        }

        $width = 160;
        $height = 60;
        $image = imagecreatetruecolor($width, $height);

        $background = imagecolorallocate($image, 248, 250, 252);
        imagefilledrectangle($image, 0, 0, $width, $height, $background);

        $noiseColor = imagecolorallocate($image, 203, 213, 225);
        for ($i = 0; $i < 60; $i++) {
            imageline(
                $image,
                random_int(0, $width),
                random_int(0, $height),
                random_int(0, $width),
                random_int(0, $height),
                $noiseColor
            );
        }

        $textColor = imagecolorallocate($image, 30, 41, 59);
        $fontSize = 5;
        $textWidth = imagefontwidth($fontSize) * strlen($code);
        $textHeight = imagefontheight($fontSize);
        $x = (int) (($width - $textWidth) / 2);
        $y = (int) (($height - $textHeight) / 2);
        imagestring($image, $fontSize, $x, $y, $code, $textColor);

        ob_start();
        imagepng($image);
        $imageData = ob_get_clean() ?: '';
        imagedestroy($image);

        return 'data:image/png;base64,'.base64_encode($imageData);
    }
}
