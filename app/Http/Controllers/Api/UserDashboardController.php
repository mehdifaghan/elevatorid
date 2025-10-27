<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Elevator;
use App\Models\Part;
use App\Models\PartTransfer;
use App\Models\ProfileRequest;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class UserDashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $companyId = $this->resolveCompanyId($request);
        $profileIds = $this->resolveProfileIds($request);

        $now = Carbon::now();
        $currentIntervalStart = $now->copy()->subDays(30);
        $previousIntervalStart = $now->copy()->subDays(60);

        $partsCount = Part::query()
            ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
            ->count();
        $transfersCount = PartTransfer::query()
            ->when($companyId, fn ($query) => $query->where(function ($builder) use ($companyId) {
                $builder->where('seller_company_id', $companyId)
                    ->orWhere('buyer_company_id', $companyId);
            }))
            ->count();
        $elevatorsCount = Elevator::query()
            ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
            ->count();
        $requestsCount = ProfileRequest::query()
            ->when($profileIds, fn ($query) => $query->whereIn('profile_id', $profileIds))
            ->count();

        $partsChange = $this->diffCount(
            Part::query()
                ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
                ->where('created_at', '>=', $currentIntervalStart)
                ->count(),
            Part::query()
                ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
                ->whereBetween('created_at', [$previousIntervalStart, $currentIntervalStart])
                ->count()
        );

        $transfersChange = $this->diffCount(
            PartTransfer::query()
                ->when($companyId, fn ($query) => $query->where(function ($builder) use ($companyId) {
                    $builder->where('seller_company_id', $companyId)
                        ->orWhere('buyer_company_id', $companyId);
                }))
                ->where('created_at', '>=', $currentIntervalStart)
                ->count(),
            PartTransfer::query()
                ->when($companyId, fn ($query) => $query->where(function ($builder) use ($companyId) {
                    $builder->where('seller_company_id', $companyId)
                        ->orWhere('buyer_company_id', $companyId);
                }))
                ->whereBetween('created_at', [$previousIntervalStart, $currentIntervalStart])
                ->count()
        );

        $elevatorsChange = $this->diffCount(
            Elevator::query()
                ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
                ->where('created_at', '>=', $currentIntervalStart)
                ->count(),
            Elevator::query()
                ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
                ->whereBetween('created_at', [$previousIntervalStart, $currentIntervalStart])
                ->count()
        );

        $requestsChange = $this->diffCount(
            ProfileRequest::query()
                ->when($profileIds, fn ($query) => $query->whereIn('profile_id', $profileIds))
                ->where('created_at', '>=', $currentIntervalStart)
                ->count(),
            ProfileRequest::query()
                ->when($profileIds, fn ($query) => $query->whereIn('profile_id', $profileIds))
                ->whereBetween('created_at', [$previousIntervalStart, $currentIntervalStart])
                ->count()
        );

        return response()->json([
            'partsCount' => $partsCount,
            'transfersCount' => $transfersCount,
            'elevatorsCount' => $elevatorsCount,
            'requestsCount' => $requestsCount,
            'partsChange' => $partsChange,
            'transfersChange' => $transfersChange,
            'elevatorsChange' => $elevatorsChange,
            'requestsChange' => $requestsChange,
        ]);
    }

    public function monthly(Request $request): JsonResponse
    {
        $now = Carbon::now()->startOfMonth();
        $months = collect(range(0, 5))
            ->map(function (int $offset) use ($now) {
                return $now->copy()->subMonths($offset);
            })
            ->sort()
            ->values();

        $companyId = $this->resolveCompanyId($request);
        $profileIds = $this->resolveProfileIds($request);

        $data = $months->map(function (Carbon $month) use ($companyId, $profileIds) {
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            return [
                'month' => $month->translatedFormat('Y-m'),
                'parts' => Part::query()
                    ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
                'transfers' => PartTransfer::query()
                    ->when($companyId, fn ($query) => $query->where(function ($builder) use ($companyId) {
                        $builder->where('seller_company_id', $companyId)
                            ->orWhere('buyer_company_id', $companyId);
                    }))
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
                'elevators' => Elevator::query()
                    ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
                    ->whereBetween('created_at', [$start, $end])
                    ->count(),
            ];
        });

        return response()->json([
            'monthlyData' => $data,
        ]);
    }

    public function partsCategories(Request $request): JsonResponse
    {
        $companyId = $this->resolveCompanyId($request);

        $rows = Part::query()
            ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
            ->selectRaw('category_id, COUNT(*) as total')
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $categoryNames = Category::query()
            ->whereIn('id', $rows->pluck('category_id')->filter()->unique())
            ->pluck('title', 'id');

        $colors = [
            '#0088FE',
            '#00C49F',
            '#FFBB28',
            '#FF8042',
            '#A855F7',
            '#F59E0B',
            '#10B981',
            '#3B82F6',
            '#EC4899',
            '#6366F1',
        ];

        $categories = $rows->values()->map(function ($row, $index) use ($colors, $categoryNames) {
            $name = $categoryNames->get($row->category_id, 'Uncategorized');

            return [
                'name' => $name,
                'value' => (int) $row->total,
                'color' => $colors[$index % count($colors)],
            ];
        });

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function activities(Request $request): JsonResponse
    {
        $companyId = $this->resolveCompanyId($request);
        $profileIds = $this->resolveProfileIds($request);

        $activities = collect()
            ->merge($this->mapTransfers($companyId))
            ->merge($this->mapElevators($companyId))
            ->merge($this->mapRequests($profileIds))
            ->sortByDesc('timestamp')
            ->take(10)
            ->map(function ($item) {
                return [
                    'id' => (string) $item['id'],
                    'type' => $item['type'],
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'time' => Carbon::parse($item['timestamp'])->diffForHumans(),
                    'status' => $item['status'],
                ];
            })
            ->values();

        return response()->json([
            'activities' => $activities,
        ]);
    }

    private function diffCount(int $current, int $previous): int
    {
        return $current - $previous;
    }

    /**
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function mapTransfers(?int $companyId): Collection
    {
        return PartTransfer::query()
            ->when($companyId, fn ($query) => $query->where(function ($builder) use ($companyId) {
                $builder->where('seller_company_id', $companyId)
                    ->orWhere('buyer_company_id', $companyId);
            }))
            ->latest()
            ->limit(10)
            ->get()
            ->map(function (PartTransfer $transfer) {
                return [
                    'id' => 'transfer-'.$transfer->id,
                    'type' => 'transfer',
                    'title' => 'انتقال قطعه #'.$transfer->part_id,
                    'description' => $transfer->buyer_company_id
                        ? 'انتقال به شرکت '.$transfer->buyer_company_id
                        : 'انتقال ثبت‌شده',
                    'status' => $transfer->status,
                    'timestamp' => $transfer->created_at ?? now(),
                ];
            });
    }

    /**
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function mapElevators(?int $companyId): Collection
    {
        return Elevator::query()
            ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
            ->latest()
            ->limit(10)
            ->get()
            ->map(function (Elevator $elevator) {
                return [
                    'id' => 'elevator-'.$elevator->id,
                    'type' => 'elevator',
                    'title' => 'آسانسور جدید '.$elevator->elevator_uid,
                    'description' => $elevator->address ?: 'آسانسور ثبت‌شده جدید',
                    'status' => $elevator->status,
                    'timestamp' => $elevator->created_at ?? now(),
                ];
            });
    }

    /**
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function mapRequests(Collection $profileIds): Collection
    {
        return ProfileRequest::query()
            ->when($profileIds->isNotEmpty(), fn ($query) => $query->whereIn('profile_id', $profileIds))
            ->latest()
            ->limit(10)
            ->get()
            ->map(function (ProfileRequest $request) {
                return [
                    'id' => 'request-'.$request->id,
                    'type' => 'request',
                    'title' => 'درخواست '.$request->type,
                    'description' => $request->note ?: 'وضعیت درخواست: '.$request->status,
                    'status' => $request->status,
                    'timestamp' => $request->created_at ?? now(),
                ];
            });
    }

    private function resolveCompanyId(Request $request): ?int
    {
        return $request->user()
            ->profiles()
            ->with('company')
            ->where('is_active', true)
            ->first()?->company?->id;
    }

    private function resolveProfileIds(Request $request): Collection
    {
        return $request->user()
            ->profiles()
            ->pluck('id');
    }
}
