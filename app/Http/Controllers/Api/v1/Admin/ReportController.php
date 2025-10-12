<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function revenue(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function expiring(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }
}
