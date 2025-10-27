<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProfileRequest;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : now()->subDays(6)->startOfDay();
        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : now()->endOfDay();

        $requests = ProfileRequest::query()
            ->whereBetween('created_at', [$from, $to])
            ->get()
            ->groupBy(fn (ProfileRequest $request) => $request->created_at->toDateString());

        $series = collect();
        $cursor = $from->copy();
        while ($cursor->lte($to)) {
            $dateKey = $cursor->toDateString();
            $series->push([
                'date' => $dateKey,
                'value' => $requests->get($dateKey, collect())->count(),
            ]);
            $cursor->addDay();
        }

        $pendingRequests = ProfileRequest::query()->where('status', 'pending')->count();

        return response()->json([
            'summary' => [
                'partsTotal' => 0,
                'transfersTotal' => 0,
                'elevatorsTotal' => 0,
                'requestsPending' => $pendingRequests,
            ],
            'series' => $series,
        ]);
    }
}
