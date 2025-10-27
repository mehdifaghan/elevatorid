<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Part;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('profiles.company');
        $companyId = $user->profiles->first()?->company?->id;

        $query = Part::query()->with('category')->orderByDesc('created_at');

        if ($companyId) {
            $query->where('registrant_company_id', $companyId);
        }

        if ($search = $request->query('q')) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('part_uid', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where(function ($builder) use ($status) {
                $builder->whereJsonContains('extra->status', $status);
            });
        }

        if ($categoryId = $request->query('categoryId')) {
            $query->where('category_id', $categoryId);
        }

        $parts = $query->get();

        return response()->json([
            'products' => $parts->map(fn (Part $part) => $this->transformPart($part)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('profiles.company');
        $company = $user->profiles->first()?->company;

        if (! $company) {
            return response()->json([
                'message' => 'Company profile is required before registering products.',
            ], 422);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'serialNumber' => ['nullable', 'string', 'max:255'],
            'categoryId' => ['nullable', 'integer', 'exists:categories,id'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric'],
            'productType' => ['nullable', 'in:manufactured,imported'],
            'manufacturerCountry' => ['nullable', 'string', 'max:255'],
            'originCountry' => ['nullable', 'string', 'max:255'],
            'productionDate' => ['nullable', 'string', 'max:50'],
            'specifications' => ['nullable', 'array'],
            'specifications.*' => ['string', 'max:255'],
            'isBatchMode' => ['nullable', 'boolean'],
            'batchQuantity' => ['nullable', 'integer', 'min:1'],
            'serialNumbers' => ['nullable', 'array'],
            'serialNumbers.*' => ['string', 'max:255'],
        ]);

        $serials = collect($validated['serialNumbers'] ?? [])
            ->filter()
            ->when(empty($validated['serialNumbers']), function ($collection) use ($validated) {
                if (! empty($validated['serialNumber'])) {
                    return $collection->push($validated['serialNumber']);
                }

                return $collection->push(Str::upper(Str::random(10)));
            });

        $customsPath = null;

        if ($request->hasFile('customsClearanceFile')) {
            $customsPath = $request->file('customsClearanceFile')
                ->store('uploads/customs', 'public');
        }

        $created = $serials->map(function (string $serial) use ($validated, $company, $customsPath) {
            $extra = [
                'model' => $validated['model'] ?? null,
                'manufacturer' => $validated['manufacturer'] ?? null,
                'brand' => $validated['brand'] ?? null,
                'price' => $validated['price'] ?? null,
                'product_type' => $validated['productType'] ?? 'manufactured',
                'production_date' => $validated['productionDate'] ?? null,
                'specifications' => $validated['specifications'] ?? [],
                'status' => 'available',
            ];

            if ($customsPath) {
                $extra['customs_clearance_file'] = $customsPath;
            }

            $part = Part::query()->create([
                'part_uid' => $this->generatePartUid(),
                'category_id' => $validated['categoryId'] ?? null,
                'title' => $validated['name'],
                'barcode' => $serial,
                'manufacturer_country' => $validated['manufacturerCountry'] ?? null,
                'origin_country' => $validated['originCountry'] ?? null,
                'registrant_company_id' => $company->id,
                'current_owner_type' => 'company',
                'current_owner_company_id' => $company->id,
                'extra' => $extra,
            ]);

            return $this->transformPart($part->fresh('category'));
        });

        return response()->json([
            'created' => $created,
        ], 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user()->loadMissing('profiles.company');
        $companyId = $user->profiles->first()?->company?->id;

        $part = Part::query()->where('id', $id)
            ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
            ->firstOrFail();

        $part->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->with('features')
            ->orderBy('title')
            ->get()
            ->map(function (Category $category) {
                return [
                    'id' => (string) $category->id,
                    'name' => $category->title,
                    'specifications' => $category->features->map(function ($feature) {
                        return [
                            'key' => $feature->key ?? Str::slug($feature->name ?? 'spec'),
                            'label' => $feature->name ?? 'ویژگی',
                            'type' => $feature->data_type ?? 'string',
                        ];
                    })->values(),
                ];
            });

        return response()->json([
            'categories' => $categories,
        ]);
    }

    private function transformPart(Part $part): array
    {
        $extra = $part->extra ?? [];

        return [
            'id' => (string) $part->id,
            'name' => $part->title,
            'model' => $extra['model'] ?? '',
            'serialNumber' => $part->barcode,
            'categoryId' => $part->category_id ? (string) $part->category_id : null,
            'categoryName' => $part->category?->title,
            'manufacturer' => $extra['manufacturer'] ?? '',
            'status' => $extra['status'] ?? 'available',
            'createdAt' => $part->created_at?->toIso8601String(),
            'price' => $extra['price'] ?? null,
            'productType' => $extra['product_type'] ?? 'manufactured',
            'specifications' => $extra['specifications'] ?? [],
            'manufacturerCountry' => $part->manufacturer_country,
            'originCountry' => $part->origin_country,
            'brand' => $extra['brand'] ?? null,
        ];
    }

    private function generatePartUid(): string
    {
        do {
            $candidate = 'PRD-'.Str::upper(Str::random(10));
        } while (Part::query()->where('part_uid', $candidate)->exists());

        return $candidate;
    }
}
