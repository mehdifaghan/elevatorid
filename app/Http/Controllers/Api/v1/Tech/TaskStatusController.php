<?php

namespace App\Http\Controllers\Api\v1\Tech;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskStatusController extends Controller
{
    public function __invoke(Request $request, int $task): JsonResponse
    {
        return response()->json(['message' => 'Task status updated']);
    }
}
