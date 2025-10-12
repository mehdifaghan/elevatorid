<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        \App\Http\Middleware\RequestId::class,
    ];

    protected $middlewareGroups = [
        'web' => [
            // web middleware stack placeholder
        ],

        'api' => [
            'throttle:api',
            \App\Http\Middleware\EnsureTenant::class,
        ],
    ];
}
