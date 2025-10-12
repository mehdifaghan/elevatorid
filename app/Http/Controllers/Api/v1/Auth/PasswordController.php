<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasswordController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Password updated']);
    }
}
