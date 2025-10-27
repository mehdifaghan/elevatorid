<?php

return [
    'otp' => [
        'ttl_seconds' => 120,
        'max_verify_attempts' => 5,
        'rate_limits' => [
            'cache' => [
                'max_attempts' => 3,
                'decay_seconds' => 60,
            ],
            'cooldown_seconds' => 90,
            'per_phone_hour' => 10,
            'per_phone_day' => 30,
            'per_ip_hour' => 25,
            'per_ip_day' => 80,
        ],
    ],
];

