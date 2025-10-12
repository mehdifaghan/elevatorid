<?php

namespace App\Services\Payment;

class PaymentService
{
    public function charge(int $amountCents, array $meta = []): string
    {
        return 'PAYMENT-REF';
    }
}
