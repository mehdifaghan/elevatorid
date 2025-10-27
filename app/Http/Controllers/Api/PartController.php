<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Models\Part;
use App\Models\PartFeatureValue;
use App\Models\PartTransfer;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->input('page', 1));
        $size = max(1, min(100, (int) $request->input('limit', $request->input('size', 15))));

        $query = Part::query()
            ->with('category')
            ->orderByDesc('created_at');

        if ($search = trim((string) $request->input('q', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('part_uid', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->input('categoryId')) {
            $query->where('category_id', $categoryId);
        }

        if ($barcode = $request->input('barcode')) {
            $query->where('barcode', $barcode);
        }

        if ($ownerType = $request->input('ownerType')) {
            $query->where('current_owner_type', $ownerType);
        }

        if ($ownerId = $request->input('ownerId')) {
            if ($request->input('ownerType') === 'elevator') {
                $query->where('current_owner_elevator_id', $ownerId);
            } else {
                $query->where('current_owner_company_id', $ownerId);
            }
        }

        $total = (clone $query)->count();
        $parts = $query->forPage($page, $size)->get();

        return response()->json([
            'items' => $parts->map(fn (Part $part) => $this->transformPart($part)),
            'pagination' => [
                'page' => $page,
                'size' => $size,
                'total' => $total,
            ],
        ]);
    }

    public function all(): JsonResponse
    {
        $parts = Part::query()->with('category')->orderBy('title')->get();

        return response()->json(
            $parts->map(fn (Part $part) => $this->transformPart($part))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePart($request);

        $user = $request->user();
        $registrantCompanyId = $user?->profiles()->first()?->company_id;

        $part = DB::transaction(function () use ($validated, $registrantCompanyId) {
            $part = Part::query()->create([
                'part_uid' => $this->generatePartUid(),
                'category_id' => $validated['categoryId'] ?? null,
                'title' => $validated['title'],
                'barcode' => $validated['barcode'] ?? null,
                'manufacturer_country' => $validated['manufacturerCountry'] ?? null,
                'origin_country' => $validated['originCountry'] ?? null,
                'registrant_company_id' => $registrantCompanyId,
                'current_owner_type' => 'company',
                'current_owner_company_id' => $registrantCompanyId,
            ]);

            $this->syncFeatureValues($part, $validated['features'] ?? []);

            return $part->fresh(['category', 'featureValues.feature']);
        });

        return response()->json($this->transformPartDetails($part), 201);
    }

    public function show(int $id): JsonResponse
    {
        $part = Part::query()
            ->with(['category', 'featureValues.feature'])
            ->findOrFail($id);

        return response()->json($this->transformPartDetails($part));
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $part = Part::query()->with(['category', 'featureValues'])->findOrFail($id);

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'categoryId' => ['nullable', 'integer', 'exists:categories,id'],
            'barcode' => ['nullable', 'string', 'max:255'],
            'manufacturerCountry' => ['nullable', 'string', 'max:255'],
            'originCountry' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'array'],
            'features.*.featureId' => ['required', 'integer', 'exists:features,id'],
            'features.*.value' => ['nullable'],
        ]);

        DB::transaction(function () use ($part, $validated) {
            if (! empty($validated['title'])) {
                $part->title = $validated['title'];
            }

            if (array_key_exists('categoryId', $validated)) {
                $part->category_id = $validated['categoryId'];
            }

            if (array_key_exists('barcode', $validated)) {
                $part->barcode = $validated['barcode'];
            }

            if (array_key_exists('manufacturerCountry', $validated)) {
                $part->manufacturer_country = $validated['manufacturerCountry'];
            }

            if (array_key_exists('originCountry', $validated)) {
                $part->origin_country = $validated['originCountry'];
            }

            $part->save();

            if (! empty($validated['features'])) {
                $this->syncFeatureValues($part, $validated['features']);
            }
        });

        return response()->json(
            $this->transformPartDetails($part->fresh(['category', 'featureValues.feature']))
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $part = Part::query()->findOrFail($id);
        $part->delete();

        return response()->json(['success' => true]);
    }

    public function transfer(int $id, Request $request): JsonResponse
    {
        $part = Part::query()->findOrFail($id);

        $validated = $request->validate([
            'buyerCompanyId' => ['required', 'integer', 'exists:companies,id'],
            'ceoOtp' => ['nullable', 'string', 'max:20'],
        ]);

        $transfer = DB::transaction(function () use ($part, $validated) {
            $transfer = PartTransfer::query()->create([
                'part_id' => $part->id,
                'seller_company_id' => $part->current_owner_company_id,
                'buyer_company_id' => $validated['buyerCompanyId'],
                'status' => 'pending',
            ]);

            return $transfer;
        });

        return response()->json($this->transformTransfer($transfer->fresh()), 201);
    }

    public function transfers(int $id, Request $request): JsonResponse
    {
        Part::query()->findOrFail($id);

        $page = max(1, (int) $request->input('page', 1));
        $size = max(1, min(100, (int) $request->input('size', 15)));

        $query = PartTransfer::query()
            ->where('part_id', $id)
            ->orderByDesc('created_at');

        $total = (clone $query)->count();
        $items = $query->forPage($page, $size)->get();

        return response()->json([
            'items' => $items->map(fn (PartTransfer $transfer) => $this->transformTransfer($transfer)),
            'pagination' => [
                'page' => $page,
                'size' => $size,
                'total' => $total,
            ],
        ]);
    }

    public function generatePdf(int $id): JsonResponse
    {
        $part = Part::query()->findOrFail($id);

        $fileName = sprintf('part-%d-%s.pdf', $part->id, Str::random(8));
        $path = 'documents/'.$fileName;

        Storage::disk('local')->put($path, 'Part document placeholder');

        return response()->json([
            'id' => $part->id,
            'type' => 'part_pdf',
            'filePath' => Storage::path($path),
            'hash' => sha1($path.Carbon::now()->toIso8601String()),
        ]);
    }

    public function generateQr(int $id): JsonResponse
    {
        $part = Part::query()->findOrFail($id);

        $payload = json_encode([
            'part_uid' => $part->part_uid,
            'title' => $part->title,
        ]);

        return response()->json([
            'success' => true,
            'qrCode' => base64_encode($payload),
        ]);
    }

    private function validatePart(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'categoryId' => ['nullable', 'integer', 'exists:categories,id'],
            'barcode' => ['nullable', 'string', 'max:255'],
            'manufacturerCountry' => ['nullable', 'string', 'max:255'],
            'originCountry' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'array'],
            'features.*.featureId' => ['required', 'integer', 'exists:features,id'],
            'features.*.value' => ['nullable'],
        ]);
    }

    private function generatePartUid(): string
    {
        do {
            $candidate = 'PRT-'.Str::upper(Str::random(8));
        } while (Part::query()->where('part_uid', $candidate)->exists());

        return $candidate;
    }

    /**
     * @param  array<int, array{featureId:int,value:mixed}>  $features
     */
    private function syncFeatureValues(Part $part, array $features): void
    {
        $featureMap = collect($features)
            ->keyBy('featureId')
            ->map(fn ($feature) => $feature['value'] ?? null);

        $existing = PartFeatureValue::query()
            ->where('part_id', $part->id)
            ->pluck('id', 'feature_id');

        foreach ($featureMap as $featureId => $value) {
            Feature::query()->findOrFail($featureId);

            PartFeatureValue::query()->updateOrCreate(
                ['part_id' => $part->id, 'feature_id' => $featureId],
                ['value' => $value]
            );
        }

        $toDelete = $existing->keys()->diff($featureMap->keys());
        if ($toDelete->isNotEmpty()) {
            PartFeatureValue::query()
                ->where('part_id', $part->id)
                ->whereIn('feature_id', $toDelete->all())
                ->delete();
        }
    }

    private function transformPart(Part $part): array
    {
        return [
            'id' => $part->id,
            'partUid' => $part->part_uid,
            'categoryId' => $part->category_id,
            'title' => $part->title,
            'barcode' => $part->barcode,
            'manufacturerCountry' => $part->manufacturer_country,
            'originCountry' => $part->origin_country,
            'registrantCompanyId' => $part->registrant_company_id,
            'currentOwner' => [
                'type' => $part->current_owner_type,
                'companyId' => $part->current_owner_company_id,
                'elevatorId' => $part->current_owner_elevator_id,
            ],
            'createdAt' => $part->created_at?->toIso8601String(),
            'updatedAt' => $part->updated_at?->toIso8601String(),
        ];
    }

    private function transformPartDetails(Part $part): array
    {
        $base = $this->transformPart($part);

        $base['category'] = $part->category ? [
            'id' => $part->category->id,
            'title' => $part->category->title,
            'slug' => $part->category->slug,
        ] : null;

        $base['features'] = $part->featureValues
            ->map(function (PartFeatureValue $value) {
                return [
                    'featureId' => $value->feature_id,
                    'name' => $value->feature?->name,
                    'key' => $value->feature?->key,
                    'value' => $value->value,
                ];
            })->values();

        return $base;
    }

    private function transformTransfer(PartTransfer $transfer): array
    {
        return [
            'id' => $transfer->id,
            'partId' => $transfer->part_id,
            'sellerCompanyId' => $transfer->seller_company_id,
            'buyerCompanyId' => $transfer->buyer_company_id,
            'approvedByCeoPhone' => $transfer->approved_by_ceo_phone,
            'approvedAt' => $transfer->approved_at?->toIso8601String(),
            'status' => $transfer->status,
            'rejectReason' => $transfer->reject_reason,
            'createdAt' => $transfer->created_at?->toIso8601String(),
        ];
    }
}
