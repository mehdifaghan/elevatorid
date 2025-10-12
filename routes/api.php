<?php

use Illuminate\Support\Facades\Route;

Route::get('/healthz', fn () => response()->json(['status' => 'ok']));

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('login', [\App\Http\Controllers\Api\v1\Auth\LoginController::class, '__invoke']);
        Route::post('refresh', [\App\Http\Controllers\Api\v1\Auth\RefreshTokenController::class, '__invoke']);
        Route::post('logout', [\App\Http\Controllers\Api\v1\Auth\LogoutController::class, '__invoke']);
    });

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('users/me', [\App\Http\Controllers\Api\v1\Auth\MeController::class, 'show']);
        Route::patch('users/me', [\App\Http\Controllers\Api\v1\Auth\MeController::class, 'update']);
        Route::post('users/me/password', [\App\Http\Controllers\Api\v1\Auth\PasswordController::class, 'update']);

        Route::prefix('manager')->group(function () {
            Route::apiResource('buildings', \App\Http\Controllers\Api\v1\Manager\BuildingController::class);
            Route::apiResource('elevators', \App\Http\Controllers\Api\v1\Manager\ElevatorController::class);
            Route::apiResource('contracts', \App\Http\Controllers\Api\v1\Manager\ContractController::class);
            Route::apiResource('tasks', \App\Http\Controllers\Api\v1\Manager\TaskController::class);
            Route::post('tasks/{task}/assign', [\App\Http\Controllers\Api\v1\Manager\TaskAssignmentController::class, '__invoke']);
        });

        Route::prefix('tech')->group(function () {
            Route::get('tasks', [\App\Http\Controllers\Api\v1\Tech\TaskController::class, 'index']);
            Route::patch('tasks/{task}/status', [\App\Http\Controllers\Api\v1\Tech\TaskStatusController::class, '__invoke']);
            Route::post('tasks/{task}/worklogs', [\App\Http\Controllers\Api\v1\Tech\WorklogController::class, 'store']);
            Route::get('worklogs', [\App\Http\Controllers\Api\v1\Tech\WorklogController::class, 'index']);
            Route::post('tasks/{task}/part-requests', [\App\Http\Controllers\Api\v1\Tech\PartRequestController::class, 'store']);
        });

        Route::prefix('warehouse')->group(function () {
            Route::apiResource('items', \App\Http\Controllers\Api\v1\Warehouse\ItemController::class);
            Route::post('items/{item}/adjust', [\App\Http\Controllers\Api\v1\Warehouse\ItemAdjustmentController::class, '__invoke']);
            Route::get('requests', [\App\Http\Controllers\Api\v1\Warehouse\PartRequestController::class, 'index']);
            Route::patch('requests/{request}', [\App\Http\Controllers\Api\v1\Warehouse\PartRequestController::class, 'update']);
            Route::apiResource('purchase-orders', \App\Http\Controllers\Api\v1\Warehouse\PurchaseOrderController::class)->only(['index', 'store', 'show']);
        });

        Route::prefix('timesheet')->group(function () {
            Route::post('clock-in', [\App\Http\Controllers\Api\v1\Timesheet\TimesheetController::class, 'clockIn']);
            Route::post('clock-out', [\App\Http\Controllers\Api\v1\Timesheet\TimesheetController::class, 'clockOut']);
            Route::get('me', [\App\Http\Controllers\Api\v1\Timesheet\TimesheetController::class, 'index']);
        });

        Route::prefix('telemetry')->group(function () {
            Route::post('location', [\App\Http\Controllers\Api\v1\Telemetry\LocationController::class, '__invoke']);
        });

        Route::prefix('notifications')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\v1\Notifications\NotificationController::class, 'index']);
            Route::patch('{notification}/read', [\App\Http\Controllers\Api\v1\Notifications\NotificationController::class, 'markAsRead']);
        });

        Route::prefix('billing')->group(function () {
            Route::apiResource('invoices', \App\Http\Controllers\Api\v1\Billing\InvoiceController::class);
            Route::post('invoices/{invoice}/payments', [\App\Http\Controllers\Api\v1\Billing\PaymentController::class, 'store']);
            Route::get('payments', [\App\Http\Controllers\Api\v1\Billing\PaymentController::class, 'index']);
        });

        Route::prefix('admin')->group(function () {
            Route::apiResource('users', \App\Http\Controllers\Api\v1\Admin\UserController::class);
            Route::apiResource('tenants', \App\Http\Controllers\Api\v1\Admin\TenantController::class);
            Route::get('tenants/{tenant}/stats', [\App\Http\Controllers\Api\v1\Admin\TenantStatsController::class, '__invoke']);
            Route::apiResource('plans', \App\Http\Controllers\Api\v1\Admin\PlanController::class);
            Route::apiResource('billing/subscriptions', \App\Http\Controllers\Api\v1\Admin\SubscriptionController::class)->only(['index', 'store', 'show', 'update']);
            Route::get('settings/{tenant}', [\App\Http\Controllers\Api\v1\Admin\TenantSettingController::class, 'show']);
            Route::patch('settings/{tenant}', [\App\Http\Controllers\Api\v1\Admin\TenantSettingController::class, 'update']);
            Route::get('dashboard/summary', [\App\Http\Controllers\Api\v1\Admin\DashboardController::class, 'summary']);
            Route::get('reports/revenue', [\App\Http\Controllers\Api\v1\Admin\ReportController::class, 'revenue']);
            Route::get('reports/expiring', [\App\Http\Controllers\Api\v1\Admin\ReportController::class, 'expiring']);
            Route::get('logs', [\App\Http\Controllers\Api\v1\Admin\LogController::class, 'index']);
        });
    });
});
