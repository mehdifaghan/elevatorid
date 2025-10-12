<?php

namespace App\Services\Sms;

class SmsService
{
    public function send(string $to, string $message): void
    {
        // Integrate with provider based on config('sms') in real app
    }
}
