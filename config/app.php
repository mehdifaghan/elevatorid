<?php

return [
    'name' => env('APP_NAME', 'LiftApp'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'UTC',
    'locale' => env('DEFAULT_LOCALE', 'fa'),
    'fallback_locale' => env('FALLBACK_LOCALE', 'en'),
];
