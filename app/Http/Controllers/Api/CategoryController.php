<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ElevatorType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $flat = filter_var($request->query('flat'), FILTER_VALIDATE_BOOLEAN);

        $categories = Category::query()
            ->with('elevatorType')
            ->orderBy('depth')
            ->orderBy('title')
            ->get();

        if ($flat) {
            return response()->json([
                'items' => $categories->map(fn (Category $category) => $this->transform($category)),
            ]);
        }

        $grouped = $categories->groupBy('parent_id');

        return response()->json([
            'items' => $this->buildTree(null, $grouped),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateCategory($request);

        /** @var Category|null $parent */
        $parent = null;
        if (! empty($validated['parentId'])) {
            $parent = Category::query()->findOrFail($validated['parentId']);
        }

        /** @var ElevatorType|null $elevatorType */
        $elevatorType = null;
        if (! empty($validated['elevatorTypeId'])) {
            $elevatorType = ElevatorType::query()->findOrFail($validated['elevatorTypeId']);
        }

        $category = DB::transaction(function () use ($validated, $parent, $elevatorType) {
            $slug = $validated['slug'] ?? Str::slug($validated['title']);
            $slug = $this->ensureUniqueSlug($slug);

            $category = Category::query()->create([
                'parent_id' => $parent?->id,
                'elevator_type_id' => $elevatorType?->id,
                'title' => $validated['title'],
                'slug' => $slug,
                'path' => $this->computePath($slug, $parent),
                'depth' => $parent ? ($parent->depth + 1) : 0,
                'is_active' => true,
            ]);

            return $category->fresh(['elevatorType']);
        });

        return response()->json($this->transform($category), 201);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $category = Category::query()->findOrFail($id);

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'isActive' => ['nullable', 'boolean'],
            'parentId' => ['nullable', 'integer', 'exists:categories,id'],
            'elevatorTypeId' => ['nullable', 'integer', 'exists:elevator_types,id'],
        ]);

        DB::transaction(function () use ($category, $validated) {
            if (array_key_exists('parentId', $validated)) {
                $category->parent_id = $validated['parentId'] ?: null;
            }

            if (array_key_exists('elevatorTypeId', $validated)) {
                $category->elevator_type_id = $validated['elevatorTypeId'] ?: null;
            }

            if (! empty($validated['title'])) {
                $category->title = $validated['title'];
            }

            $slugChanged = false;
            if (! empty($validated['slug'])) {
                $slug = $validated['slug'];
                if ($slug !== $category->slug) {
                    $slug = $this->ensureUniqueSlug($slug, $category->id);
                    $category->slug = $slug;
                    $slugChanged = true;
                }
            }

            if (array_key_exists('isActive', $validated)) {
                $category->is_active = (bool) $validated['isActive'];
            }

            $category->save();

            if ($slugChanged || array_key_exists('parentId', $validated)) {
                $this->refreshPath($category);
            }
        });

        $category->load('elevatorType');

        return response()->json($this->transform($category));
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::query()->findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    private function validateCategory(Request $request): array
    {
        return $request->validate([
            'parentId' => ['nullable', 'integer', 'exists:categories,id'],
            'elevatorTypeId' => ['nullable', 'integer', 'exists:elevator_types,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function transform(Category $category, array $children = []): array
    {
        return [
            'id' => $category->id,
            'parentId' => $category->parent_id,
            'title' => $category->title,
            'slug' => $category->slug,
            'path' => $category->path,
            'depth' => $category->depth,
            'isActive' => (bool) $category->is_active,
            'elevatorTypeId' => $category->elevator_type_id,
            'elevatorTypeName' => $category->elevatorType?->name,
            'children' => $children,
        ];
    }

    /**
     * @param  int|null  $parentId
     * @param  \Illuminate\Support\Collection<int, \Illuminate\Support\Collection<int, Category>>  $grouped
     * @return array<int, array<string, mixed>>
     */
    private function buildTree(?int $parentId, $grouped): array
    {
        $children = $grouped->get($parentId, collect());

        return $children->map(function (Category $category) use ($grouped) {
            $branch = $this->buildTree($category->id, $grouped);
            return $this->transform($category, $branch);
        })->values()->all();
    }

    private function ensureUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug);
        $candidate = $baseSlug;
        $counter = 1;

        while (
            Category::query()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }

    private function computePath(string $slug, ?Category $parent): string
    {
        if ($parent) {
            $parentPath = $parent->path ?: '/'.$parent->slug;
            return rtrim($parentPath, '/').'/'.$slug;
        }

        return '/'.$slug;
    }

    private function refreshPath(Category $category): void
    {
        $parent = $category->parent()->first();
        $category->depth = $parent ? ($parent->depth + 1) : 0;
        $category->path = $this->computePath($category->slug, $parent);
        $category->save();

        $category->load('children');

        foreach ($category->children as $child) {
            $this->refreshPath($child);
        }
    }
}
