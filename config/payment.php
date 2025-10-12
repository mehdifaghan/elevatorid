<?php

return [
    'default' => env('PAYMENT_GATEWAY', 'zarinpal'),
    'gateways' => [
        'zarinpal' => [
            'key' => env('PAYMENT_KEY'),
            'callback_url' => env('APP_URL').'/payments/callback/zarinpal',
        ],
        'nextpay' => [
            'key' => env('PAYMENT_KEY'),
            'callback_url' => env('APP_URL').'/payments/callback/nextpay',
        ],
    ],
];
