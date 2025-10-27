<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ElevatorType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ElevatorTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $types = ElevatorType::query()
            ->orderBy('name')
            ->get()
            ->map(fn (ElevatorType $type) => $this->transform($type));

        return response()->json(['items' => $types]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'isActive' => ['nullable', 'boolean'],
        ]);

        $type = ElevatorType::query()->create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['isActive'] ?? true,
        ]);

        return response()->json($this->transform($type), 201);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $type = ElevatorType::query()->findOrFail($id);

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'isActive' => ['nullable', 'boolean'],
        ]);

        if (! empty($validated['name'])) {
            $type->name = $validated['name'];
        }

        if (array_key_exists('description', $validated)) {
            $type->description = $validated['description'];
        }

        if (array_key_exists('isActive', $validated)) {
            $type->is_active = (bool) $validated['isActive'];
        }

        $type->save();

        return response()->json($this->transform($type));
    }

    public function destroy(int $id): JsonResponse
    {
        $type = ElevatorType::query()->findOrFail($id);
        $type->delete();

        return response()->json(['success' => true]);
    }

    private function transform(ElevatorType $type): array
    {
        return [
            'id' => $type->id,
            'name' => $type->name,
            'description' => $type->description,
            'isActive' => (bool) $type->is_active,
        ];
    }
}
