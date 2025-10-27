<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\ProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalUsers = User::count();
        $totalProfiles = Profile::count();
        $pendingRequests = ProfileRequest::query()->where('status', 'pending')->count();
        $approvedRequests = ProfileRequest::query()->where('status', 'approved')->count();

        $recentActivity = ProfileRequest::query()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (ProfileRequest $request) {
                return [
                    'id' => (string) $request->id,
                    'type' => ucfirst($request->type).' request',
                    'description' => sprintf(
                        '%s profile request for profile #%d',
                        ucfirst($request->status),
                        $request->profile_id
                    ),
                    'timestamp' => $request->updated_at?->toIso8601String() ?? $request->created_at->toIso8601String(),
                    'status' => $request->status,
                ];
            })->values();

        return response()->json([
            'totalElevators' => 0,
            'totalParts' => 0,
            'totalTransfers' => 0,
            'totalUsers' => $totalUsers,
            'totalProfiles' => $totalProfiles,
            'pendingRequests' => $pendingRequests,
            'approvedRequests' => $approvedRequests,
            'activeTransfers' => 0,
            'recentActivity' => $recentActivity,
        ]);
    }
}
