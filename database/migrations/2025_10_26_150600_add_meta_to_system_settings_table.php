<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('registration_enabled');
        });

        DB::table('system_settings')
            ->whereNull('meta')
            ->update([
                'meta' => json_encode([
                    'general' => [
                        'siteName' => 'ElevatorID',
                        'siteDescription' => 'سامانه مدیریت اطلاعات آسانسور',
                        'supportEmail' => 'support@example.com',
                        'supportPhone' => '+982112345678',
                        'maintenanceMessage' => null,
                        'logoUrl' => null,
                        'faviconUrl' => null,
                        'timezone' => 'Asia/Tehran',
                        'locale' => 'fa',
                    ],
                    'notifications' => [
                        'emailEnabled' => true,
                        'smsEnabled' => false,
                        'pushEnabled' => false,
                        'webhookUrl' => null,
                        'dailyReportEnabled' => true,
                        'weeklyReportEnabled' => true,
                        'errorNotificationEnabled' => true,
                    ],
                    'security' => [
                        'otpEnabled' => true,
                        'otpExpiryMinutes' => 5,
                        'maxLoginAttempts' => 5,
                        'lockoutDurationMinutes' => 30,
                        'passwordMinLength' => 8,
                        'passwordRequireSpecialChars' => true,
                        'captchaEnabled' => true,
                        'ipWhitelistEnabled' => false,
                        'ipWhitelist' => [],
                    ],
                    'uploads' => [
                        'maxFileSize' => 10,
                        'allowedImageTypes' => ['jpg', 'jpeg', 'png'],
                        'allowedDocumentTypes' => ['pdf', 'docx'],
                        'uploadPath' => 'uploads',
                        'enableImageResize' => false,
                        'maxImageWidth' => 1920,
                        'maxImageHeight' => 1080,
                    ],
                    'backup' => [
                        'autoBackupEnabled' => false,
                        'backupFrequency' => 'weekly',
                        'backupRetentionDays' => 30,
                        'backupStoragePath' => 'backups',
                        'includeUploads' => false,
                        'compressionEnabled' => true,
                        'lastRunAt' => null,
                    ],
                    'sms' => [
                        'provider' => 'farapayamak',
                        'username' => '',
                        'password' => '',
                        'sender' => '',
                        'enabled' => false,
                    ],
                    'payment' => [
                        'provider' => 'mellat',
                        'terminalId' => '',
                        'merchantId' => '',
                        'secretKey' => '',
                        'enabled' => false,
                        'testMode' => true,
                    ],
                    'paymentTypes' => [
                        'partsPaymentEnabled' => true,
                        'partsPaymentPrice' => 0,
                        'elevatorPaymentEnabled' => true,
                        'elevatorPaymentPrice' => 0,
                    ],
                ]),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {
            $table->dropColumn('meta');
        });
    }
};
