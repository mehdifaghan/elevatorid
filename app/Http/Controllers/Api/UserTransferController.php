<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Part;
use App\Models\PartTransfer;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserTransferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('profiles.company');
        $companyId = $user->profiles->first()?->company?->id;

        $query = PartTransfer::query()
            ->with('part')
            ->orderByDesc('created_at');

        if ($companyId) {
            $query->where(function ($builder) use ($companyId) {
                $builder->where('seller_company_id', $companyId)
                    ->orWhere('buyer_company_id', $companyId);
            });
        }

        $transfers = $query->get();

        return response()->json([
            'transfers' => $transfers->map(fn (PartTransfer $transfer) => $this->transform($transfer, $companyId)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('profiles.company');
        $company = $user->profiles->first()?->company;

        if (! $company) {
            return response()->json([
                'message' => 'Company profile is required before registering transfers.',
            ], 422);
        }

        $validated = $request->validate([
            'partId' => ['required', 'integer', 'exists:parts,id'],
            'direction' => ['required', 'in:incoming,outgoing'],
            'otherCompanyId' => ['nullable', 'integer'],
            'otherCompanyName' => ['nullable', 'string', 'max:255'],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'transferDate' => ['nullable', 'date'],
        ]);

        $part = Part::query()->findOrFail($validated['partId']);

        if ($validated['direction'] === 'outgoing' && $part->current_owner_company_id !== $company->id) {
            return response()->json([
                'message' => 'Selected part is not owned by your company.',
            ], 422);
        }

        $transfer = PartTransfer::query()->create([
            'part_id' => $part->id,
            'seller_company_id' => $validated['direction'] === 'outgoing' ? $company->id : $validated['otherCompanyId'],
            'buyer_company_id' => $validated['direction'] === 'incoming' ? $company->id : $validated['otherCompanyId'],
            'direction' => $validated['direction'],
            'other_company_name' => $validated['otherCompanyName'],
            'reason' => $validated['reason'],
            'notes' => $validated['notes'],
            'transfer_date' => isset($validated['transferDate'])
                ? Carbon::parse($validated['transferDate'])
                : Carbon::now(),
            'status' => 'pending',
        ]);

        ActivityLog::query()->create([
            'user_id' => $user->id,
            'scope' => 'user',
            'action' => 'create_transfer',
            'description' => 'Transfer request created for part '.$part->title,
            'meta' => [
                'part_id' => $part->id,
                'transfer_id' => $transfer->id,
                'direction' => $validated['direction'],
            ],
        ]);

        return response()->json([
            'transfer' => $this->transform($transfer->fresh('part'), $company->id),
        ], 201);
    }

    private function transform(PartTransfer $transfer, ?int $companyId): array
    {
        $part = $transfer->part;

        return [
            'id' => (string) $transfer->id,
            'partId' => (string) $transfer->part_id,
            'partName' => $part?->title ?? 'Part #'.$transfer->part_id,
            'partSerial' => $part?->barcode,
            'direction' => $transfer->direction ?? ($transfer->seller_company_id === $companyId ? 'outgoing' : 'incoming'),
            'otherCompanyId' => $transfer->seller_company_id === $companyId
                ? $transfer->buyer_company_id
                : $transfer->seller_company_id,
            'otherCompanyName' => $transfer->other_company_name,
            'transferDate' => ($transfer->transfer_date ?? $transfer->created_at ?? Carbon::now())->toDateString(),
            'status' => $this->mapStatus($transfer->status),
            'reason' => $transfer->reason,
            'notes' => $transfer->notes,
            'createdAt' => $transfer->created_at?->toIso8601String(),
            'updatedAt' => $transfer->updated_at?->toIso8601String(),
        ];
    }

    private function mapStatus(?string $status): string
    {
        return match ($status) {
            'approved' => 'completed',
            'rejected' => 'cancelled',
            'pending' => 'pending',
            default => 'pending',
        };
    }
}
