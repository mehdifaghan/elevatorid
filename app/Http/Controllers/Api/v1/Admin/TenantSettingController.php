<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantSettingController extends Controller
{
    public function show(int $tenant): JsonResponse
    {
        return response()->json(['data' => ['tenant_id' => $tenant]]);
    }

    public function update(Request $request, int $tenant): JsonResponse
    {
        return response()->json(['message' => 'Settings updated']);
    }
}
