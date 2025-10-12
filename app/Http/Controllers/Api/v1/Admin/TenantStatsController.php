<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TenantStatsController extends Controller
{
    public function __invoke(int $tenant): JsonResponse
    {
        return response()->json(['data' => ['tenant_id' => $tenant, 'stats' => []]]);
    }
}
