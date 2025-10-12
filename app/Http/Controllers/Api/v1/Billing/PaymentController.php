<?php

namespace App\Http\Controllers\Api\v1\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function store(Request $request, int $invoice): JsonResponse
    {
        return response()->json(['message' => 'Payment recorded'], 201);
    }
}
