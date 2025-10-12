<?php

namespace App\Http\Controllers\Api\v1\Tech;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorklogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function store(Request $request, int $task): JsonResponse
    {
        return response()->json(['message' => 'Worklog created'], 201);
    }
}
