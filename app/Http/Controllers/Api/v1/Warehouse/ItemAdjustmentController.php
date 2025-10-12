<?php

namespace App\Http\Controllers\Api\v1\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemAdjustmentController extends Controller
{
    public function __invoke(Request $request, int $item): JsonResponse
    {
        return response()->json(['message' => 'Stock adjusted']);
    }
}
