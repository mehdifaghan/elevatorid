<?php

namespace App\Http\Controllers\Api\v1\Timesheet;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimesheetController extends Controller
{
    public function clockIn(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Clocked in']);
    }

    public function clockOut(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Clocked out']);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }
}
