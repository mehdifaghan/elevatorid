<?php

return [
    'provider' => env('SMS_PROVIDER', 'kavenegar'),
    'providers' => [
        'kavenegar' => [
            'api_key' => env('SMS_API_KEY'),
            'sender' => env('SMS_SENDER'),
        ],
    ],
];
