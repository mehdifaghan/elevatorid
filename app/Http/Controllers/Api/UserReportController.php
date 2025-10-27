<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Elevator;
use App\Models\Part;
use App\Models\PartTransfer;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        [$from, $to] = $this->resolveRange($request->query('dateRange'), $request);
        $user = $request->user()->loadMissing('profiles.company');
        $companyId = $user->profiles->first()?->company?->id;

        $monthlyData = $this->buildMonthlyData($from, $to, $companyId);
        $partsCategories = $this->buildCategoryData($from, $to, $companyId);
        $transferValue = $this->buildTransferValueData($from, $to, $companyId);
        $elevatorStatus = $this->buildElevatorStatusData($companyId);

        $summary = [
            'totalParts' => Part::query()
                ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
                ->count(),
            'totalTransfers' => PartTransfer::query()
                ->when($companyId, fn ($query) => $query->where(function ($builder) use ($companyId) {
                    $builder->where('seller_company_id', $companyId)
                        ->orWhere('buyer_company_id', $companyId);
                }))
                ->count(),
            'totalElevators' => Elevator::query()
                ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
                ->count(),
            'totalValue' => $transferValue->sum('value'),
        ];

        return response()->json([
            'monthlyData' => $monthlyData,
            'partsCategoryData' => $partsCategories,
            'transferValueData' => $transferValue,
            'elevatorStatusData' => $elevatorStatus,
            'summary' => $summary,
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        [$from, $to] = $this->resolveRange($request->query('dateRange'), $request);
        $user = $request->user();
        $companyId = $user->profiles()->first()?->company?->id;

        $monthlyData = $this->buildMonthlyData($from, $to, $companyId);
        $transferValue = $this->buildTransferValueData($from, $to, $companyId);

        $format = $request->query('format', 'excel');
        $extension = $format === 'pdf' ? 'txt' : 'csv';
        $filename = 'user-report-'.$from->format('Ymd').'-'.$to->format('Ymd').'.'.$extension;

        $callback = function () use ($monthlyData, $transferValue) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Monthly Overview']);
            fputcsv($handle, ['Month', 'Parts', 'Transfers', 'Elevators']);
            foreach ($monthlyData as $row) {
                fputcsv($handle, [$row['month'], $row['parts'], $row['transfers'], $row['elevators']]);
            }

            fputcsv($handle, []);
            fputcsv($handle, ['Transfer Values']);
            fputcsv($handle, ['Date', 'Incoming', 'Outgoing', 'Value']);
            foreach ($transferValue as $row) {
                fputcsv($handle, [$row['date'], $row['incoming'], $row['outgoing'], $row['value']]);
            }

            fclose($handle);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => $format === 'pdf'
                ? 'text/plain'
                : 'text/csv',
        ]);
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    private function resolveRange(?string $range, Request $request): array
    {
        $to = Carbon::now()->endOfDay();
        $from = Carbon::now()->subMonth()->startOfDay();

        return match ($range) {
            'last_week' => [Carbon::now()->subWeek()->startOfDay(), $to],
            'last_quarter' => [Carbon::now()->subMonths(3)->startOfDay(), $to],
            'custom' => [
                Carbon::parse($request->query('from', Carbon::now()->subMonth()->format('Y-m-d')))->startOfDay(),
                Carbon::parse($request->query('to', Carbon::now()->format('Y-m-d')))->endOfDay(),
            ],
            default => [$from, $to],
        };
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildMonthlyData(Carbon $from, Carbon $to, ?int $companyId): array
    {
        $months = collect();
        $cursor = $from->copy()->startOfMonth();

        while ($cursor->lte($to)) {
            $months->push($cursor->copy());
            $cursor->addMonth();
        }

        return $months->map(function (Carbon $month) use ($companyId) {
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
        })->toArray();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildCategoryData(Carbon $from, Carbon $to, ?int $companyId): array
    {
        $rows = Part::query()
            ->when($companyId, fn ($query) => $query->where('registrant_company_id', $companyId))
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw('category_id, COUNT(*) as total')
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

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

        return $rows->values()->map(function ($row, $index) use ($colors) {
            return [
                'name' => optional($row->category)->title ?? 'دسته‌بندی نشده',
                'value' => (int) $row->total,
                'color' => $colors[$index % count($colors)],
            ];
        })->toArray();
    }

    /**
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function buildTransferValueData(Carbon $from, Carbon $to, ?int $companyId): Collection
    {
        return PartTransfer::query()
            ->with('part')
            ->when($companyId, fn ($query) => $query->where(function ($builder) use ($companyId) {
                $builder->where('seller_company_id', $companyId)
                    ->orWhere('buyer_company_id', $companyId);
            }))
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at')
            ->get()
            ->groupBy(fn (PartTransfer $transfer) => $transfer->transfer_date?->toDateString() ?? $transfer->created_at?->toDateString())
            ->map(function (Collection $items, $date) {
                return [
                    'date' => $date,
                    'incoming' => $items->where('direction', 'incoming')->count(),
                    'outgoing' => $items->where('direction', 'outgoing')->count(),
                    'value' => $items->sum(function (PartTransfer $transfer) {
                        return (int) ($transfer->part?->extra['price'] ?? 0);
                    }),
                ];
            })
            ->values();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildElevatorStatusData(?int $companyId): array
    {
        return Elevator::query()
            ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get()
            ->map(function ($row) {
                return [
                    'status' => $row->status,
                    'count' => (int) $row->total,
                    'color' => match ($row->status) {
                        'active' => '#10B981',
                        'maintenance' => '#F59E0B',
                        'out_of_order' => '#EF4444',
                        'suspended' => '#6B7280',
                        default => '#3B82F6',
                    },
                ];
            })
            ->toArray();
    }
}
