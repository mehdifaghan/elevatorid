<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profiles()->where('is_active', true)->first() ?? $user->profiles()->first();

        abort_if(! $profile, 422, 'No profile available for initiating payment.');

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
            'currency' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string', 'max:255'],
            'callbackUrl' => ['nullable', 'url'],
        ]);

        $payment = Payment::query()->create([
            'payer_profile_id' => $profile->id,
            'amount' => (int) $validated['amount'],
            'currency' => $validated['currency'] ?? 'IRR',
            'description' => $validated['description'] ?? null,
            'gateway' => 'mock',
            'ref_num' => $this->generateReference(),
            'status' => 'initiated',
            'meta' => [
                'callbackUrl' => $validated['callbackUrl'] ?? null,
            ],
        ]);

        return response()->json($this->transform($payment), 201);
    }

    public function verify(int $id, Request $request): JsonResponse
    {
        $payment = Payment::query()->findOrFail($id);

        $userProfileIds = $request->user()->profiles()->pluck('id');
        abort_unless($userProfileIds->contains($payment->payer_profile_id), 403, 'Payment does not belong to current user.');

        $validated = $request->validate([
            'RefId' => ['required', 'string', 'max:255'],
            'ResCode' => ['required', 'string', 'max:10'],
            'SaleOrderId' => ['nullable', 'string', 'max:255'],
            'SaleReferenceId' => ['nullable', 'string', 'max:255'],
        ]);

        $status = in_array($validated['ResCode'], ['0', '00'], true) ? 'success' : 'failed';

        $meta = $payment->meta ?? [];
        $meta['verify'] = $validated;

        $payment->fill([
            'status' => $status,
            'ref_num' => $validated['RefId'],
            'meta' => $meta,
        ])->save();

        return response()->json($this->transform($payment));
    }

    private function transform(Payment $payment): array
    {
        return [
            'id' => $payment->id,
            'payerProfileId' => $payment->payer_profile_id,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'description' => $payment->description,
            'gateway' => $payment->gateway,
            'refNum' => $payment->ref_num,
            'status' => $payment->status,
            'meta' => $payment->meta ?? (object) [],
            'createdAt' => $payment->created_at?->toIso8601String(),
        ];
    }

    private function generateReference(): string
    {
        return 'PAY-'.Str::upper(Str::random(10));
    }
}
