<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')), 
    'expiration' => env('SANCTUM_EXPIRATION', null),
    'refresh_expiration' => env('REFRESH_TOKEN_EXPIRATION', 43200),
];
