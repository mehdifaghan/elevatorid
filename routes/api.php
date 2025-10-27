<?php

use App\Http\Controllers\Api\Admin\CoworkerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\RequestController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CaptchaController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\ElevatorController;
use App\Http\Controllers\Api\ElevatorTypeController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\PartController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileRequestController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\UserProductController;
use App\Http\Controllers\Api\UserRequestController;
use App\Http\Controllers\Api\UserReportController;
use App\Http\Controllers\Api\UserSettingsController;
use App\Http\Controllers\Api\UserTransferController;
use App\Http\Controllers\Api\UserWalletController;
use App\Http\Controllers\Api\UserElevatorController;
use Illuminate\Support\Facades\Route;

Route::match(['get', 'post'], 'captcha', [CaptchaController::class, 'store']);
Route::post('captcha/validate', [CaptchaController::class, 'validateValue']);

Route::post('auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('auth/refresh', [AuthController::class, 'refreshToken']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me', [AuthController::class, 'updateMe']);
    Route::post('profiles/{profile}/documents', [AuthController::class, 'uploadProfileDocument']);

    // Catalog
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('features', [FeatureController::class, 'index']);
    Route::get('elevator-types', [ElevatorTypeController::class, 'index']);

    // Parts
    Route::get('parts', [PartController::class, 'index']);
    Route::get('parts/all', [PartController::class, 'all']);
    Route::get('parts/{id}', [PartController::class, 'show']);

    // Elevators
    Route::get('elevators', [ElevatorController::class, 'index']);
    Route::get('elevators/{id}', [ElevatorController::class, 'show']);

    // User dashboard
    Route::prefix('user/dashboard')->group(function () {
        Route::get('stats', [UserDashboardController::class, 'stats']);
        Route::get('monthly', [UserDashboardController::class, 'monthly']);
        Route::get('parts-categories', [UserDashboardController::class, 'partsCategories']);
        Route::get('activities', [UserDashboardController::class, 'activities']);
    });

    Route::get('user/profile', [UserProfileController::class, 'show']);
    Route::get('user/activity-logs', [UserProfileController::class, 'activityLogs']);
    Route::put('user/profile/basic', [UserProfileController::class, 'updateBasic']);
    Route::put('user/profile/company', [UserProfileController::class, 'updateCompany']);
    Route::post('user/change-password', [UserProfileController::class, 'changePassword']);
    Route::get('user/profile/check', [UserProfileController::class, 'check']);

    Route::get('user/settings', [UserSettingsController::class, 'show']);
    Route::put('user/settings', [UserSettingsController::class, 'update']);
    Route::put('user/settings/notifications', [UserSettingsController::class, 'updateNotifications']);
    Route::put('user/settings/privacy', [UserSettingsController::class, 'updatePrivacy']);
    Route::put('user/settings/display', [UserSettingsController::class, 'updateDisplay']);

    Route::get('user/wallet/balance', [UserWalletController::class, 'balance']);

    Route::get('user/products', [UserProductController::class, 'index']);
    Route::get('user/product-categories', [UserProductController::class, 'categories']);
    Route::post('user/products', [UserProductController::class, 'store']);
    Route::delete('user/products/{id}', [UserProductController::class, 'destroy']);

    Route::get('user/transfers', [UserTransferController::class, 'index']);
    Route::post('user/transfers', [UserTransferController::class, 'store']);

    Route::get('user/reports', [UserReportController::class, 'index']);
    Route::get('user/reports/export', [UserReportController::class, 'export']);

    Route::get('user/elevators', [UserElevatorController::class, 'index']);
    Route::post('user/elevators', [UserElevatorController::class, 'store']);
    Route::post('user/elevators/{id}/change-part', [UserElevatorController::class, 'changePart']);
    Route::post('user/elevators/{id}/maintenance', [UserElevatorController::class, 'maintenance']);

    Route::get('user/requests', [UserRequestController::class, 'index']);
    Route::post('user/requests', [UserRequestController::class, 'store']);

    // User requests & complaints
    Route::get('requests', [ProfileRequestController::class, 'index']);
    Route::post('requests', [ProfileRequestController::class, 'store']);
    Route::get('complaints', [ComplaintController::class, 'index']);
    Route::post('complaints', [ComplaintController::class, 'store']);

    // Payments
    Route::post('payments', [PaymentController::class, 'store']);
    Route::post('payments/{id}/verify', [PaymentController::class, 'verify']);

    // Protected write operations for managers
    Route::middleware('admin')->group(function () {
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{id}', [CategoryController::class, 'update']);
        Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('features', [FeatureController::class, 'store']);
        Route::put('features/{id}', [FeatureController::class, 'update']);
        Route::delete('features/{id}', [FeatureController::class, 'destroy']);

        Route::post('elevator-types', [ElevatorTypeController::class, 'store']);
        Route::put('elevator-types/{id}', [ElevatorTypeController::class, 'update']);
        Route::delete('elevator-types/{id}', [ElevatorTypeController::class, 'destroy']);

        Route::post('parts', [PartController::class, 'store']);
        Route::put('parts/{id}', [PartController::class, 'update']);
        Route::delete('parts/{id}', [PartController::class, 'destroy']);
        Route::post('parts/{id}/transfer', [PartController::class, 'transfer']);
        Route::get('parts/{id}/transfers', [PartController::class, 'transfers']);
        Route::post('parts/{id}/pdf', [PartController::class, 'generatePdf']);
        Route::post('parts/{id}/qr', [PartController::class, 'generateQr']);

        Route::post('elevators', [ElevatorController::class, 'store']);
        Route::put('elevators/{id}', [ElevatorController::class, 'update']);
        Route::post('elevators/{id}/parts', [ElevatorController::class, 'installPart']);
        Route::put('elevators/{id}/parts/{partId}', [ElevatorController::class, 'replacePart']);
        Route::post('elevators/{id}/pdf', [ElevatorController::class, 'generatePdf']);
        Route::post('elevators/{id}/certificate', [ElevatorController::class, 'generateCertificate']);
        Route::post('elevators/{id}/qr', [ElevatorController::class, 'generateQr']);
        Route::put('elevators/{id}/status', [ElevatorController::class, 'updateStatus']);
    });

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('profile', [AdminProfileController::class, 'show']);
        Route::get('activity-logs', [AdminProfileController::class, 'activityLogs']);
        Route::put('profile', [AdminProfileController::class, 'update']);
        Route::post('change-password', [AdminProfileController::class, 'changePassword']);

        Route::get('settings', [SettingsController::class, 'show']);
        Route::put('settings/general', [SettingsController::class, 'updateGeneral']);
        Route::put('settings/notifications', [SettingsController::class, 'updateNotifications']);
        Route::put('settings/security', [SettingsController::class, 'updateSecurity']);
        Route::put('settings/uploads', [SettingsController::class, 'updateUploads']);
        Route::put('settings/backup', [SettingsController::class, 'updateBackup']);
        Route::put('settings/sms', [SettingsController::class, 'updateSms']);
        Route::post('settings/sms/test', [SettingsController::class, 'testSms']);
        Route::put('settings/payment', [SettingsController::class, 'updatePayment']);
        Route::post('settings/payment/test', [SettingsController::class, 'testPayment']);
        Route::put('settings/payment-types', [SettingsController::class, 'updatePaymentTypes']);
        Route::post('upload', [SettingsController::class, 'uploadAsset']);
        Route::post('backup/create', [SettingsController::class, 'createBackup']);

        Route::get('users/stats', [UserController::class, 'stats']);
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);
        Route::post('users/{id}/sms', [UserController::class, 'sendSms']);
        Route::get('users/export', [UserController::class, 'export']);

        Route::post('coworkers', [CoworkerController::class, 'store']);

        Route::get('requests', [RequestController::class, 'index']);
        Route::get('requests/stats', [RequestController::class, 'stats']);
        Route::post('requests/{id}/approve', [RequestController::class, 'approve']);
        Route::post('requests/{id}/respond', [RequestController::class, 'respond']);
        Route::get('reports/overview', [ReportController::class, 'overview']);
    });
});
