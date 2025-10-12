<?php

namespace App\Http\Controllers\Api\v1\Tech;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartRequestController extends Controller
{
    public function store(Request $request, int $task): JsonResponse
    {
        return response()->json(['message' => 'Part request submitted'], 201);
    }
}
