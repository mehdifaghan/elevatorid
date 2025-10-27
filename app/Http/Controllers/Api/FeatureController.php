<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class FeatureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categoryId = $request->query('categoryId');

        $query = Feature::query()->with('category')->orderBy('name');

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $features = $query->get();

        return response()->json([
            'items' => $features->map(fn (Feature $feature) => $this->transform($feature)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateFeature($request);

        Category::query()->findOrFail($validated['categoryId']);

        $feature = Feature::query()->create([
            'category_id' => $validated['categoryId'],
            'name' => $validated['name'],
            'key' => $validated['key'] ?? Str::snake($validated['name']),
            'data_type' => $validated['dataType'],
            'enum_values' => $validated['enumValues'] ?? null,
        ]);

        return response()->json($this->transform($feature), 201);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $feature = Feature::query()->findOrFail($id);

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'key' => ['nullable', 'string', 'max:255'],
            'dataType' => ['nullable', Rule::in(['string', 'number', 'boolean', 'date', 'enum'])],
            'enumValues' => ['nullable', 'array'],
            'enumValues.*' => ['string', 'max:255'],
        ]);

        if (! empty($validated['name'])) {
            $feature->name = $validated['name'];
        }

        if (! empty($validated['key'])) {
            $feature->key = $validated['key'];
        }

        if (! empty($validated['dataType'])) {
            $feature->data_type = $validated['dataType'];
        }

        if (array_key_exists('enumValues', $validated)) {
            $feature->enum_values = $validated['enumValues'];
        }

        $feature->save();

        return response()->json($this->transform($feature));
    }

    public function destroy(int $id): JsonResponse
    {
        $feature = Feature::query()->findOrFail($id);
        $feature->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    private function validateFeature(Request $request): array
    {
        $validated = $request->validate([
            'categoryId' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'key' => ['nullable', 'string', 'max:255'],
            'dataType' => ['required', Rule::in(['string', 'number', 'boolean', 'date', 'enum'])],
            'enumValues' => ['nullable', 'array'],
            'enumValues.*' => ['string', 'max:255'],
        ]);

        if ($validated['dataType'] === 'enum' && empty($validated['enumValues'])) {
            $request->validate([
                'enumValues' => ['required', 'array', 'min:1'],
            ]);
        }

        return $validated;
    }

    private function transform(Feature $feature): array
    {
        return [
            'id' => $feature->id,
            'categoryId' => $feature->category_id,
            'name' => $feature->name,
            'key' => $feature->key,
            'dataType' => $feature->data_type,
            'enumValues' => $feature->enum_values ?? [],
        ];
    }
}
