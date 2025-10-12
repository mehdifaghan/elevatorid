<?php

use Monolog\Handler\StreamHandler;
use Monolog\Processor\UidProcessor;

return [
    'default' => env('LOG_CHANNEL', 'stack'),

    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['single'],
            'ignore_exceptions' => false,
        ],

        'single' => [
            'driver' => 'monolog',
            'handler' => StreamHandler::class,
            'with' => [
                'stream' => storage_path('logs/laravel.log'),
            ],
            'processors' => [
                UidProcessor::class,
            ],
        ],
    ],
];
