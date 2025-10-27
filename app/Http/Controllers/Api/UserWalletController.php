<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserWalletController extends Controller
{
    public function balance(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('profiles');
        $profile = $user->profiles->first();

        if (! $profile) {
            return response()->json([
                'balance' => 0,
                'currency' => 'IRR',
                'lastUpdate' => Carbon::now()->toIso8601String(),
            ]);
        }

        $payments = Payment::query()
            ->where('payer_profile_id', $profile->id)
            ->get();

        $balance = $payments
            ->where('status', 'success')
            ->sum('amount');

        $lastUpdate = $payments
            ->sortByDesc(fn (Payment $payment) => $payment->updated_at ?? $payment->created_at)
            ->first();

        return response()->json([
            'balance' => (int) $balance,
            'currency' => $payments->first()->currency ?? 'IRR',
            'lastUpdate' => ($lastUpdate?->updated_at ?? $lastUpdate?->created_at ?? Carbon::now())->toIso8601String(),
        ]);
    }
}
