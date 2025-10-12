<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::fallback(function () {
                abort(404);
            });
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register global and group middleware configuration hooks here when needed.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Register exception handling callbacks here when needed.
    })
    ->create();
