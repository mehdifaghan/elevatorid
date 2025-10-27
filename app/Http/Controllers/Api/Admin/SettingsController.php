<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = $this->settings();

        return response()->json($this->transform($settings));
    }

    public function updateGeneral(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'siteName' => ['required', 'string', 'max:255'],
            'siteDescription' => ['nullable', 'string'],
            'supportEmail' => ['required', 'email', 'max:255'],
            'supportPhone' => ['required', 'string', 'max:50'],
            'maintenanceMode' => ['required', 'boolean'],
            'registrationEnabled' => ['required', 'boolean'],
            'logoUrl' => ['nullable', 'string', 'max:500'],
            'faviconUrl' => ['nullable', 'string', 'max:500'],
        ]);

        $meta = $settings->meta ?? [];
        $meta['general'] = array_merge($meta['general'] ?? [], [
            'siteName' => $validated['siteName'],
            'siteDescription' => $validated['siteDescription'] ?? '',
            'supportEmail' => $validated['supportEmail'],
            'supportPhone' => $validated['supportPhone'],
            'logoUrl' => $validated['logoUrl'] ?? null,
            'faviconUrl' => $validated['faviconUrl'] ?? null,
        ]);

        $settings->fill([
            'system_maintenance' => $validated['maintenanceMode'],
            'registration_enabled' => $validated['registrationEnabled'],
            'meta' => $meta,
        ])->save();

        return response()->json($this->transform($settings->fresh()));
    }

    public function updateNotifications(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'emailEnabled' => ['required', 'boolean'],
            'smsEnabled' => ['required', 'boolean'],
            'pushEnabled' => ['required', 'boolean'],
            'webhookUrl' => ['nullable', 'string', 'max:500'],
            'dailyReportEnabled' => ['required', 'boolean'],
            'weeklyReportEnabled' => ['required', 'boolean'],
            'errorNotificationEnabled' => ['required', 'boolean'],
        ]);

        $meta = $settings->meta ?? [];
        $meta['notifications'] = $validated;

        $settings->forceFill(['meta' => $meta])->save();

        return response()->json(['success' => true]);
    }

    public function updateSecurity(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'otpEnabled' => ['required', 'boolean'],
            'otpExpiryMinutes' => ['required', 'integer', 'min:1', 'max:60'],
            'maxLoginAttempts' => ['required', 'integer', 'min:1', 'max:20'],
            'lockoutDurationMinutes' => ['required', 'integer', 'min:1', 'max:720'],
            'passwordMinLength' => ['required', 'integer', 'min:6', 'max:64'],
            'passwordRequireSpecialChars' => ['required', 'boolean'],
            'captchaEnabled' => ['required', 'boolean'],
            'ipWhitelistEnabled' => ['required', 'boolean'],
            'ipWhitelist' => ['nullable', 'string'],
        ]);

        $meta = $settings->meta ?? [];
        $meta['security'] = $validated;

        $settings->forceFill(['meta' => $meta])->save();

        return response()->json(['success' => true]);
    }

    public function updateUploads(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'maxFileSize' => ['required', 'integer', 'min:1', 'max:100'],
            'allowedImageTypes' => ['required', 'array'],
            'allowedImageTypes.*' => ['string', 'max:10'],
            'allowedDocumentTypes' => ['required', 'array'],
            'allowedDocumentTypes.*' => ['string', 'max:10'],
            'uploadPath' => ['required', 'string', 'max:255'],
            'enableImageResize' => ['required', 'boolean'],
            'maxImageWidth' => ['required', 'integer', 'min:100', 'max:8000'],
            'maxImageHeight' => ['required', 'integer', 'min:100', 'max:8000'],
        ]);

        $meta = $settings->meta ?? [];
        $meta['uploads'] = $validated;

        $settings->forceFill(['meta' => $meta])->save();

        return response()->json(['success' => true]);
    }

    public function updateBackup(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'autoBackupEnabled' => ['required', 'boolean'],
            'backupFrequency' => ['required', Rule::in(['daily', 'weekly', 'monthly'])],
            'backupRetentionDays' => ['required', 'integer', 'min:1', 'max:365'],
            'backupStoragePath' => ['required', 'string', 'max:255'],
            'includeUploads' => ['required', 'boolean'],
            'compressionEnabled' => ['required', 'boolean'],
        ]);

        $meta = $settings->meta ?? [];
        $current = $meta['backup'] ?? [];
        $meta['backup'] = array_merge($current, $validated);

        $settings->forceFill(['meta' => $meta])->save();

        return response()->json(['success' => true]);
    }

    public function updateSms(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'provider' => ['required', Rule::in(['farapayamak', 'kavenegar'])],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'sender' => ['nullable', 'string', 'max:50'],
            'enabled' => ['required', 'boolean'],
        ]);

        $meta = $settings->meta ?? [];
        $meta['sms'] = $validated;

        $settings->forceFill([
            'sms_provider' => $validated['provider'],
            'sms_config' => [
                'username' => $validated['username'],
                'password' => $validated['password'],
                'sender' => $validated['sender'],
            ],
            'meta' => $meta,
        ])->save();

        return response()->json(['success' => true]);
    }

    public function testSms(Request $request): JsonResponse
    {
        $request->validate([
            'testNumber' => ['required', 'regex:/^09\d{9}$/'],
            'message' => ['required', 'string', 'max:160'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'پیامک آزمایشی با موفقیت در صف ارسال قرار گرفت (محیط توسعه).',
        ]);
    }

    public function updatePayment(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'provider' => ['required', Rule::in(['mellat', 'parsian'])],
            'terminalId' => ['nullable', 'string', 'max:100'],
            'merchantId' => ['nullable', 'string', 'max:100'],
            'secretKey' => ['nullable', 'string', 'max:255'],
            'enabled' => ['required', 'boolean'],
            'testMode' => ['required', 'boolean'],
        ]);

        $meta = $settings->meta ?? [];
        $meta['payment'] = $validated;

        $settings->forceFill([
            'payment_provider' => $validated['provider'],
            'payment_config' => [
                'terminalId' => $validated['terminalId'],
                'merchantId' => $validated['merchantId'],
                'secretKey' => $validated['secretKey'],
            ],
            'meta' => $meta,
        ])->save();

        return response()->json(['success' => true]);
    }

    public function testPayment(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
            'cardNumber' => ['required', 'string', 'max:16'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تراکنش آزمایشی با موفقیت شبیه‌سازی شد (محیط توسعه).',
        ]);
    }

    public function updatePaymentTypes(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $validated = $request->validate([
            'partsPaymentEnabled' => ['required', 'boolean'],
            'partsPaymentPrice' => ['required', 'numeric', 'min:0'],
            'elevatorPaymentEnabled' => ['required', 'boolean'],
            'elevatorPaymentPrice' => ['required', 'numeric', 'min:0'],
        ]);

        $meta = $settings->meta ?? [];
        $meta['paymentTypes'] = $validated;

        $settings->forceFill(['meta' => $meta])->save();

        return response()->json(['success' => true]);
    }

    public function uploadAsset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', File::image()->max(5 * 1024)],
        ]);

        $path = $request->file('file')->store('settings', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    public function createBackup(Request $request): JsonResponse
    {
        $settings = $this->settings();

        $meta = $settings->meta ?? [];
        $backup = $meta['backup'] ?? [];
        $backup['lastRunAt'] = now()->toIso8601String();
        $meta['backup'] = $backup;

        $settings->forceFill(['meta' => $meta])->save();

        return response()->json([
            'success' => true,
            'message' => 'پشتیبان‌گیری با موفقیت در محیط توسعه شبیه‌سازی شد.',
        ]);
    }

    private function settings(): SystemSetting
    {
        return SystemSetting::query()->firstOrFail();
    }

    private function transform(SystemSetting $settings): array
    {
        $meta = $settings->meta ?? [];

        $general = $meta['general'] ?? [];
        $notifications = $meta['notifications'] ?? [];
        $security = $meta['security'] ?? [];
        $uploads = $meta['uploads'] ?? [];
        $backup = $meta['backup'] ?? [];
        $sms = $meta['sms'] ?? [];
        $payment = $meta['payment'] ?? [];
        $paymentTypes = $meta['paymentTypes'] ?? [];

        return [
            'general' => [
                'siteName' => Arr::get($general, 'siteName', 'ElevatorID'),
                'siteDescription' => Arr::get($general, 'siteDescription', ''),
                'supportEmail' => Arr::get($general, 'supportEmail', ''),
                'supportPhone' => Arr::get($general, 'supportPhone', ''),
                'maintenanceMode' => (bool) $settings->system_maintenance,
                'registrationEnabled' => (bool) $settings->registration_enabled,
                'logoUrl' => Arr::get($general, 'logoUrl'),
                'faviconUrl' => Arr::get($general, 'faviconUrl'),
            ],
            'notifications' => [
                'emailEnabled' => (bool) Arr::get($notifications, 'emailEnabled', true),
                'smsEnabled' => (bool) Arr::get($notifications, 'smsEnabled', false),
                'pushEnabled' => (bool) Arr::get($notifications, 'pushEnabled', false),
                'webhookUrl' => Arr::get($notifications, 'webhookUrl'),
                'dailyReportEnabled' => (bool) Arr::get($notifications, 'dailyReportEnabled', true),
                'weeklyReportEnabled' => (bool) Arr::get($notifications, 'weeklyReportEnabled', true),
                'errorNotificationEnabled' => (bool) Arr::get($notifications, 'errorNotificationEnabled', true),
            ],
            'security' => [
                'otpEnabled' => (bool) Arr::get($security, 'otpEnabled', true),
                'otpExpiryMinutes' => (int) Arr::get($security, 'otpExpiryMinutes', 5),
                'maxLoginAttempts' => (int) Arr::get($security, 'maxLoginAttempts', 5),
                'lockoutDurationMinutes' => (int) Arr::get($security, 'lockoutDurationMinutes', 30),
                'passwordMinLength' => (int) Arr::get($security, 'passwordMinLength', 8),
                'passwordRequireSpecialChars' => (bool) Arr::get($security, 'passwordRequireSpecialChars', true),
                'captchaEnabled' => (bool) Arr::get($security, 'captchaEnabled', true),
                'ipWhitelistEnabled' => (bool) Arr::get($security, 'ipWhitelistEnabled', false),
                'ipWhitelist' => Arr::get($security, 'ipWhitelist', ''),
            ],
            'uploads' => [
                'maxFileSize' => (int) Arr::get($uploads, 'maxFileSize', 10),
                'allowedImageTypes' => Arr::get($uploads, 'allowedImageTypes', ['jpg', 'jpeg', 'png']),
                'allowedDocumentTypes' => Arr::get($uploads, 'allowedDocumentTypes', ['pdf']),
                'uploadPath' => Arr::get($uploads, 'uploadPath', 'uploads'),
                'enableImageResize' => (bool) Arr::get($uploads, 'enableImageResize', false),
                'maxImageWidth' => (int) Arr::get($uploads, 'maxImageWidth', 1920),
                'maxImageHeight' => (int) Arr::get($uploads, 'maxImageHeight', 1080),
            ],
            'backup' => [
                'autoBackupEnabled' => (bool) Arr::get($backup, 'autoBackupEnabled', false),
                'backupFrequency' => Arr::get($backup, 'backupFrequency', 'weekly'),
                'backupRetentionDays' => (int) Arr::get($backup, 'backupRetentionDays', 30),
                'backupStoragePath' => Arr::get($backup, 'backupStoragePath', 'backups'),
                'includeUploads' => (bool) Arr::get($backup, 'includeUploads', false),
                'compressionEnabled' => (bool) Arr::get($backup, 'compressionEnabled', true),
                'lastRunAt' => Arr::get($backup, 'lastRunAt'),
            ],
            'sms' => [
                'provider' => Arr::get($sms, 'provider', $settings->sms_provider),
                'username' => Arr::get($sms, 'username', Arr::get($settings->sms_config ?? [], 'username')),
                'password' => Arr::get($sms, 'password', Arr::get($settings->sms_config ?? [], 'password')),
                'sender' => Arr::get($sms, 'sender', Arr::get($settings->sms_config ?? [], 'sender')),
                'enabled' => (bool) Arr::get($sms, 'enabled', false),
            ],
            'payment' => [
                'provider' => Arr::get($payment, 'provider', $settings->payment_provider),
                'terminalId' => Arr::get($payment, 'terminalId', Arr::get($settings->payment_config ?? [], 'terminalId')),
                'merchantId' => Arr::get($payment, 'merchantId', Arr::get($settings->payment_config ?? [], 'merchantId')),
                'secretKey' => Arr::get($payment, 'secretKey', Arr::get($settings->payment_config ?? [], 'secretKey')),
                'enabled' => (bool) Arr::get($payment, 'enabled', false),
                'testMode' => (bool) Arr::get($payment, 'testMode', true),
            ],
            'paymentTypes' => [
                'partsPaymentEnabled' => (bool) Arr::get($paymentTypes, 'partsPaymentEnabled', true),
                'partsPaymentPrice' => (float) Arr::get($paymentTypes, 'partsPaymentPrice', 0),
                'elevatorPaymentEnabled' => (bool) Arr::get($paymentTypes, 'elevatorPaymentEnabled', true),
                'elevatorPaymentPrice' => (float) Arr::get($paymentTypes, 'elevatorPaymentPrice', 0),
            ],
        ];
    }
}
