<?php

namespace App\Services;

use App\Models\OtpCode;
use App\Models\SmsLog;
use Illuminate\Cache\RateLimiter;
use Illuminate\Support\Carbon;
use RuntimeException;

class OtpService
{
    public function __construct(private readonly RateLimiter $rateLimiter)
    {
    }

    public function ensureCanSend(string $phone, string $ipAddress): void
    {
        $this->checkBurstLimit($phone, $ipAddress);
        $this->checkPolicyLimits($phone, $ipAddress);
    }

    public function generate(string $phone): string
    {
        $ttlSeconds = (int) config('sms.otp.ttl_seconds', 120);
        $maxAttempts = (int) config('sms.otp.max_verify_attempts', 5);

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $hash = hash('sha256', $code);
        $expiresAt = now()->addSeconds($ttlSeconds);

        OtpCode::query()->updateOrCreate(
            ['phone' => $phone],
            [
                'code_hash' => $hash,
                'attempts_remaining' => $maxAttempts,
                'expires_at' => $expiresAt,
                'last_attempt_at' => null,
                'last_sent_at' => now(),
            ]
        );

        return $code;
    }

    public function verify(string $phone, string $code): bool
    {
        /** @var OtpCode|null $record */
        $record = OtpCode::query()->where('phone', $phone)->first();

        if (! $record) {
            return false;
        }

        if ($record->expires_at instanceof Carbon && $record->expires_at->isPast()) {
            $record->delete();

            return false;
        }

        if ((int) $record->attempts_remaining <= 0) {
            $record->delete();

            return false;
        }

        $hashedInput = hash('sha256', $code);

        if (hash_equals($record->code_hash, $hashedInput)) {
            $record->delete();

            return true;
        }

        $record->decrement('attempts_remaining');
        $record->forceFill([
            'last_attempt_at' => now(),
        ])->save();

        return false;
    }

    public function clear(string $phone): void
    {
        OtpCode::query()->where('phone', $phone)->delete();
    }

    public function attachLog(string $phone, SmsLog $log): void
    {
        OtpCode::query()
            ->where('phone', $phone)
            ->update([
                'sms_log_id' => $log->id,
                'last_sent_at' => $log->sent_at ?? now(),
            ]);
    }

    private function checkBurstLimit(string $phone, string $ipAddress): void
    {
        $cacheLimit = config('sms.otp.rate_limits.cache.max_attempts');
        $decay = config('sms.otp.rate_limits.cache.decay_seconds');

        if (! $cacheLimit || ! $decay) {
            return;
        }

        $key = sprintf('otp-rate:%s:%s', $phone, $ipAddress);

        if ($this->rateLimiter->tooManyAttempts($key, (int) $cacheLimit)) {
            throw new RuntimeException('تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.');
        }

        $this->rateLimiter->hit($key, (int) $decay);
    }

    private function checkPolicyLimits(string $phone, string $ipAddress): void
    {
        $limits = (array) config('sms.otp.rate_limits', []);
        $now = now();
        $oneHourAgo = $now->copy()->subHour();
        $oneDayAgo = $now->copy()->subDay();

        $cooldownSeconds = $limits['cooldown_seconds'] ?? null;

        if ($cooldownSeconds) {
            $recent = SmsLog::query()
                ->where('purpose', 'otp')
                ->where('phone', $phone)
                ->whereIn('status', [SmsLog::STATUS_PENDING, SmsLog::STATUS_SENT])
                ->orderByDesc('requested_at')
                ->first();

            if ($recent && $recent->requested_at) {
                $elapsed = $recent->requested_at->diffInSeconds($now);
                if ($elapsed < $cooldownSeconds) {
                    throw new RuntimeException('لطفاً کمی صبر کنید و سپس مجدداً تلاش نمایید.');
                }
            }
        }

        $perPhoneHour = $limits['per_phone_hour'] ?? null;
        if ($perPhoneHour !== null) {
            $count = SmsLog::query()
                ->where('purpose', 'otp')
                ->where('phone', $phone)
                ->where('requested_at', '>=', $oneHourAgo)
                ->count();

            if ($count >= (int) $perPhoneHour) {
                throw new RuntimeException('سقف ارسال در ساعت اخیر برای این شماره تکمیل شده است.');
            }
        }

        $perPhoneDay = $limits['per_phone_day'] ?? null;
        if ($perPhoneDay !== null) {
            $count = SmsLog::query()
                ->where('purpose', 'otp')
                ->where('phone', $phone)
                ->where('requested_at', '>=', $oneDayAgo)
                ->count();

            if ($count >= (int) $perPhoneDay) {
                throw new RuntimeException('سقف ارسال روزانه برای این شماره تکمیل شده است.');
            }
        }

        if ($ipAddress) {
            $perIpHour = $limits['per_ip_hour'] ?? null;
            if ($perIpHour !== null) {
                $count = SmsLog::query()
                    ->where('purpose', 'otp')
                    ->where('ip_address', $ipAddress)
                    ->where('requested_at', '>=', $oneHourAgo)
                    ->count();

                if ($count >= (int) $perIpHour) {
                    throw new RuntimeException('تعداد درخواست‌های این IP در ساعت اخیر بیش از حد مجاز است.');
                }
            }

            $perIpDay = $limits['per_ip_day'] ?? null;
            if ($perIpDay !== null) {
                $count = SmsLog::query()
                    ->where('purpose', 'otp')
                    ->where('ip_address', $ipAddress)
                    ->where('requested_at', '>=', $oneDayAgo)
                    ->count();

                if ($count >= (int) $perIpDay) {
                    throw new RuntimeException('سقف روزانه‌ی این IP برای ارسال کد تکمیل شده است.');
                }
            }
        }
    }
}
