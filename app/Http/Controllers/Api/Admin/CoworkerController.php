<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminCoworker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CoworkerController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'orgName' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'unique:admin_coworkers,phone'],
            'access' => ['required', 'array'],
            'access.mgmtReports' => ['boolean'],
            'access.partsInquiry' => ['boolean'],
            'access.elevatorsInquiry' => ['boolean'],
        ]);

        $coworker = AdminCoworker::query()->create([
            'org_name' => $validated['orgName'],
            'phone' => $validated['phone'],
            'access_mgmt_reports' => (bool) ($validated['access']['mgmtReports'] ?? false),
            'access_parts_inquiry' => (bool) ($validated['access']['partsInquiry'] ?? false),
            'access_elevators_inquiry' => (bool) ($validated['access']['elevatorsInquiry'] ?? false),
        ]);

        return response()->json([
            'id' => $coworker->id,
            'orgName' => $coworker->org_name,
            'phone' => $coworker->phone,
            'access' => [
                'mgmtReports' => $coworker->access_mgmt_reports,
                'partsInquiry' => $coworker->access_parts_inquiry,
                'elevatorsInquiry' => $coworker->access_elevators_inquiry,
            ],
        ], Response::HTTP_CREATED);
    }
}
