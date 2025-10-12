<?php

return [
    'tenant_model' => App\Domain\Tenants\Tenant::class,
    'central_domains' => [
        env('APP_URL', 'http://localhost'),
    ],
    'database' => [
        'manager' => 'mysql',
    ],
];
