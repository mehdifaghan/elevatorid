<?php

namespace App\Services;

use App\Models\SystemSetting;
use App\Models\SmsLog;
use App\Services\Sms\FarapayamakClient;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class SmsService
{
    /**
     * Dispatch an OTP SMS message and persist the delivery log.
     */
    public function sendOtp(string $phone, string $message, ?string $ipAddress = null, array $meta = []): SmsLog
    {
        $config = $this->resolveConfig();
        $metaPayload = array_merge($meta, [
            'otp_ttl' => config('sms.otp.ttl_seconds', 120),
        ]);

        $log = SmsLog::query()->create([
            'phone' => $phone,
            'ip_address' => $ipAddress,
            'purpose' => 'otp',
            'provider' => $config['provider'],
            'status' => SmsLog::STATUS_PENDING,
            'message' => $message,
            'message_hash' => hash('sha256', $message),
            'requested_at' => now(),
            'meta' => $metaPayload,
        ]);

        if (! $config['enabled']) {
            if (app()->environment('local', 'testing')) {
                $log->forceFill([
                    'status' => SmsLog::STATUS_SKIPPED,
                    'error_message' => 'SMS provider disabled in current environment.',
                    'sent_at' => now(),
                ])->save();

                Log::info('Skipping OTP SMS dispatch because SMS provider is disabled.', [
                    'phone' => $phone,
                    'message' => $message,
                ]);

                return $log;
            }

            $log->forceFill([
                'status' => SmsLog::STATUS_FAILED,
                'error_message' => 'SMS service is disabled.',
            ])->save();

            throw new RuntimeException('SMS service is disabled.');
        }

        if (! $config['username'] || ! $config['password'] || ! $config['sender']) {
            if (app()->environment('local', 'testing')) {
                $log->forceFill([
                    'status' => SmsLog::STATUS_SKIPPED,
                    'error_message' => 'SMS credentials missing in current environment.',
                    'sent_at' => now(),
                ])->save();

                Log::warning('Skipping OTP SMS dispatch due to missing provider credentials.', [
                    'phone' => $phone,
                ]);

                return $log;
            }

            $log->forceFill([
                'status' => SmsLog::STATUS_FAILED,
                'error_message' => 'SMS provider credentials are not configured.',
            ])->save();

            throw new RuntimeException('SMS provider credentials are not configured.');
        }

        if ($config['provider'] !== 'farapayamak') {
            $log->forceFill([
                'status' => SmsLog::STATUS_FAILED,
                'error_message' => sprintf('Unsupported SMS provider "%s".', $config['provider'] ?? 'unknown'),
            ])->save();

            throw new RuntimeException(sprintf('Unsupported SMS provider "%s".', $config['provider'] ?? 'unknown'));
        }

        $client = new FarapayamakClient(
            $config['username'],
            $config['password'],
            verifySsl: true
        );

        try {
            $response = $client->SendSMS($phone, $config['sender'], $message, false);
        } catch (Throwable $exception) {
            $log->forceFill([
                'status' => SmsLog::STATUS_FAILED,
                'error_message' => $exception->getMessage(),
            ])->save();

            Log::error('Failed to send OTP SMS via Farapayamak.', [
                'phone' => $phone,
                'exception' => $exception->getMessage(),
            ]);

            throw new RuntimeException('Failed to send SMS message.', previous: $exception);
        }

        if (($response['RetStatus'] ?? null) !== 1) {
            $log->forceFill([
                'status' => SmsLog::STATUS_FAILED,
                'provider_message_id' => $response['MsgID'] ?? null,
                'error_code' => (string) ($response['RetStatus'] ?? 'unknown'),
                'error_message' => $response['StrRetStatus'] ?? 'Unknown provider error.',
                'meta' => array_merge($log->meta ?? [], [
                    'ret_status' => $response['RetStatus'] ?? null,
                ]),
            ])->save();

            Log::warning('Farapayamak returned an unsuccessful status for OTP SMS.', [
                'phone' => $phone,
                'response' => $response,
            ]);

            throw new RuntimeException('SMS provider returned an error.');
        }

        $log->forceFill([
            'status' => SmsLog::STATUS_SENT,
            'provider_message_id' => $response['MsgID'] ?? null,
            'sent_at' => now(),
            'meta' => array_merge($log->meta ?? [], [
                'ret_status' => $response['RetStatus'] ?? null,
            ]),
        ])->save();

        Log::info('OTP SMS dispatched successfully.', [
            'phone' => $phone,
            'messageId' => $response['MsgID'] ?? null,
            'sms_log_id' => $log->id,
        ]);

        return $log;
    }

    /**
     * @return array{
     *     provider: string|null,
     *     enabled: bool,
     *     username: string|null,
     *     password: string|null,
     *     sender: string|null
     * }
     */
    private function resolveConfig(): array
    {
        $settings = SystemSetting::query()->first();

        if (! $settings) {
            throw new RuntimeException('System settings could not be loaded.');
        }

        $meta = $settings->meta ?? [];
        $smsMeta = is_array($meta) ? Arr::get($meta, 'sms', []) : [];
        $smsConfig = $settings->sms_config ?? [];

        $provider = Arr::get($smsMeta, 'provider', $settings->sms_provider ?? null);
        $enabled = $this->truthy(Arr::get($smsMeta, 'enabled', false));

        $username = Arr::get($smsMeta, 'username', Arr::get($smsConfig, 'username'));
        $password = Arr::get($smsMeta, 'password', Arr::get($smsConfig, 'password'));
        $sender = Arr::get($smsMeta, 'sender', Arr::get($smsConfig, 'sender'));

        return [
            'provider' => $provider,
            'enabled' => $enabled,
            'username' => $username ? trim((string) $username) : null,
            'password' => $password ? trim((string) $password) : null,
            'sender' => $sender ? trim((string) $sender) : null,
        ];
    }

    private function truthy(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_int($value)) {
            return $value === 1;
        }

        if (is_string($value)) {
            $normalized = strtolower(trim($value));

            return in_array($normalized, ['1', 'true', 'yes', 'on'], true);
        }

        return false;
    }
}
