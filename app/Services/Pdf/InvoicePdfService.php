<?php

namespace App\Services\Pdf;

class InvoicePdfService
{
    public function build(int $invoiceId): string
    {
        return storage_path('app/invoices/'.$invoiceId.'.pdf');
    }
}
