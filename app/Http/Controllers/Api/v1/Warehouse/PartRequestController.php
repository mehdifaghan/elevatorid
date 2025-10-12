<?php

namespace App\Http\Controllers\Api\v1\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function update(Request $request, int $requestId): JsonResponse
    {
        return response()->json(['message' => 'Part request updated']);
    }
}
