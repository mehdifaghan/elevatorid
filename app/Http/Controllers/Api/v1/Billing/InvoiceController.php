<?php

namespace App\Http\Controllers\Api\v1\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Invoice created'], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => ['id' => $id]]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        return response()->json(['message' => 'Invoice updated']);
    }

    public function destroy(int $id): JsonResponse
    {
        return response()->json([], 204);
    }
}
