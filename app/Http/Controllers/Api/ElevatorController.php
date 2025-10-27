<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Elevator;
use App\Models\Part;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ElevatorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->input('page', 1));
        $size = max(1, min(100, (int) $request->input('limit', $request->input('size', 15))));

        $query = Elevator::query()->orderByDesc('created_at');

        if ($search = trim((string) $request->input('q', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('elevator_uid', 'like', "%{$search}%")
                    ->orWhere('registry_plate', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($uid = $request->input('elevatorUid')) {
            $query->where('elevator_uid', $uid);
        }

        if ($province = $request->input('province')) {
            $query->where('province', $province);
        }

        if ($city = $request->input('city')) {
            $query->where('city', $city);
        }

        $total = (clone $query)->count();
        $items = $query->forPage($page, $size)->get();

        return response()->json([
            'items' => $items->map(fn (Elevator $elevator) => $this->transformElevator($elevator)),
            'pagination' => [
                'page' => $page,
                'size' => $size,
                'total' => $total,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateElevator($request);

        $elevator = DB::transaction(function () use ($validated) {
            $elevator = Elevator::query()->create([
                'elevator_uid' => $this->generateElevatorUid(),
                'municipality_zone' => $validated['municipalityZone'] ?? null,
                'build_permit_no' => $validated['buildPermitNo'] ?? null,
                'registry_plate' => $validated['registryPlate'] ?? null,
                'province' => $validated['province'] ?? null,
                'city' => $validated['city'] ?? null,
                'address' => $validated['address'] ?? null,
                'postal_code' => $validated['postalCode'] ?? null,
                'installer_company_id' => $validated['installerCompanyId'] ?? null,
                'status' => 'active',
            ]);

            foreach ($validated['parts'] ?? [] as $partData) {
                $this->attachPart($elevator, $partData['partId'], [
                    'installed_at' => Carbon::now(),
                    'installer_company_id' => $validated['installerCompanyId'] ?? null,
                ]);
            }

            return $elevator->fresh('parts');
        });

        return response()->json([
            'success' => true,
            'data' => $this->transformElevatorDetails($elevator),
            'message' => 'Elevator created successfully.',
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $elevator = Elevator::query()
            ->with('parts')
            ->findOrFail($id);

        return response()->json($this->transformElevatorDetails($elevator));
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $elevator = Elevator::query()->findOrFail($id);

        $validated = $request->validate([
            'municipalityZone' => ['nullable', 'string', 'max:255'],
            'buildPermitNo' => ['nullable', 'string', 'max:255'],
            'registryPlate' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'postalCode' => ['nullable', 'string', 'max:20'],
        ]);

        $elevator->fill([
            'municipality_zone' => $validated['municipalityZone'] ?? $elevator->municipality_zone,
            'build_permit_no' => $validated['buildPermitNo'] ?? $elevator->build_permit_no,
            'registry_plate' => $validated['registryPlate'] ?? $elevator->registry_plate,
            'province' => $validated['province'] ?? $elevator->province,
            'city' => $validated['city'] ?? $elevator->city,
            'address' => $validated['address'] ?? $elevator->address,
            'postal_code' => $validated['postalCode'] ?? $elevator->postal_code,
        ])->save();

        return response()->json($this->transformElevatorDetails($elevator->fresh('parts')));
    }

    public function installPart(int $elevatorId, Request $request): JsonResponse
    {
        $elevator = Elevator::query()->findOrFail($elevatorId);

        $validated = $request->validate([
            'partId' => ['required', 'integer', 'exists:parts,id'],
            'installedAt' => ['nullable', 'date'],
        ]);

        $this->attachPart($elevator, $validated['partId'], [
            'installed_at' => isset($validated['installedAt'])
                ? Carbon::parse($validated['installedAt'])
                : Carbon::now(),
            'installer_company_id' => $elevator->installer_company_id,
        ]);

        $pivot = $elevator->parts()->withPivot(['id', 'installed_at', 'removed_at', 'installer_company_id'])
            ->where('parts.id', $validated['partId'])
            ->first()
            ?->pivot;

        return response()->json([
            'id' => $pivot?->id,
            'elevatorId' => $elevator->id,
            'partId' => $validated['partId'],
            'installedAt' => $pivot?->installed_at
                ? Carbon::parse($pivot->installed_at)->toIso8601String()
                : null,
            'removedAt' => $pivot?->removed_at
                ? Carbon::parse($pivot->removed_at)->toIso8601String()
                : null,
            'installerCompanyId' => $pivot?->installer_company_id,
        ]);
    }

    public function replacePart(int $elevatorId, int $partId, Request $request): JsonResponse
    {
        $elevator = Elevator::query()->findOrFail($elevatorId);
        $part = Part::query()->findOrFail($partId);

        $validated = $request->validate([
            'replaceWithPartId' => ['nullable', 'integer', 'exists:parts,id'],
            'removedAt' => ['nullable', 'date'],
        ]);

        DB::transaction(function () use ($elevator, $part, $validated) {
            $pivot = $elevator->parts()
                ->where('parts.id', $part->id)
                ->first()?->pivot;

            if ($pivot) {
                $pivot->removed_at = isset($validated['removedAt'])
                    ? Carbon::parse($validated['removedAt'])
                    : Carbon::now();
                $pivot->save();
            }

            $part->current_owner_type = 'company';
            $part->current_owner_elevator_id = null;
            $part->save();

            if (! empty($validated['replaceWithPartId'])) {
                $this->attachPart($elevator, $validated['replaceWithPartId'], [
                    'installed_at' => Carbon::now(),
                    'installer_company_id' => $elevator->installer_company_id,
                ]);
            }
        });

        return response()->json($this->transformElevatorDetails($elevator->fresh('parts')));
    }

    public function generatePdf(int $id): JsonResponse
    {
        $elevator = Elevator::query()->findOrFail($id);

        $fileName = sprintf('elevator-%d-%s.pdf', $elevator->id, Str::random(8));
        $path = 'documents/'.$fileName;
        Storage::disk('local')->put($path, 'Elevator document placeholder');

        return response()->json([
            'id' => $elevator->id,
            'type' => 'elevator_pdf',
            'filePath' => Storage::path($path),
            'hash' => sha1($path.Carbon::now()->toIso8601String()),
        ]);
    }

    public function generateCertificate(int $id): JsonResponse
    {
        $elevator = Elevator::query()->findOrFail($id);

        $fileName = sprintf('certificate-%d-%s.pdf', $elevator->id, Str::random(8));
        $path = 'documents/'.$fileName;
        Storage::disk('local')->put($path, 'Certificate placeholder');

        return response()->json([
            'success' => true,
            'certificateUrl' => Storage::path($path),
        ]);
    }

    public function generateQr(int $id): JsonResponse
    {
        $elevator = Elevator::query()->findOrFail($id);

        $payload = json_encode([
            'elevator_uid' => $elevator->elevator_uid,
            'registry_plate' => $elevator->registry_plate,
        ]);

        return response()->json([
            'success' => true,
            'qrCode' => base64_encode($payload),
        ]);
    }

    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $elevator = Elevator::query()->findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:active,maintenance,out_of_order,suspended'],
        ]);

        $elevator->status = $validated['status'];
        $elevator->save();

        return response()->json($this->transformElevatorDetails($elevator->fresh('parts')));
    }

    private function validateElevator(Request $request): array
    {
        return $request->validate([
            'municipalityZone' => ['nullable', 'string', 'max:255'],
            'buildPermitNo' => ['nullable', 'string', 'max:255'],
            'registryPlate' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'postalCode' => ['nullable', 'string', 'max:20'],
            'installerCompanyId' => ['nullable', 'integer', 'exists:companies,id'],
            'parts' => ['nullable', 'array'],
            'parts.*.partId' => ['required', 'integer', 'exists:parts,id'],
        ]);
    }

    private function generateElevatorUid(): string
    {
        do {
            $candidate = 'ELV-'.Str::upper(Str::random(8));
        } while (Elevator::query()->where('elevator_uid', $candidate)->exists());

        return $candidate;
    }

    private function attachPart(Elevator $elevator, int $partId, array $pivotData): void
    {
        Part::query()->findOrFail($partId);

        $pivotData = array_merge([
            'installed_at' => Carbon::now(),
            'installer_company_id' => $pivotData['installer_company_id'] ?? null,
        ], $pivotData);

        $existingPivot = $elevator->parts()
            ->where('parts.id', $partId)
            ->first();

        if ($existingPivot) {
            $elevator->parts()->updateExistingPivot($partId, [
                'installed_at' => $pivotData['installed_at'],
                'removed_at' => null,
                'installer_company_id' => $pivotData['installer_company_id'],
            ]);
        } else {
            $elevator->parts()->attach($partId, [
                'installed_at' => $pivotData['installed_at'],
                'removed_at' => null,
                'installer_company_id' => $pivotData['installer_company_id'],
            ]);
        }

        Part::query()
            ->where('id', $partId)
            ->update([
                'current_owner_type' => 'elevator',
                'current_owner_elevator_id' => $elevator->id,
                'current_owner_company_id' => null,
            ]);
    }

    private function transformElevator(Elevator $elevator): array
    {
        return [
            'id' => $elevator->id,
            'elevatorUid' => $elevator->elevator_uid,
            'municipalityZone' => $elevator->municipality_zone,
            'buildPermitNo' => $elevator->build_permit_no,
            'registryPlate' => $elevator->registry_plate,
            'province' => $elevator->province,
            'city' => $elevator->city,
            'address' => $elevator->address,
            'postalCode' => $elevator->postal_code,
            'installerCompanyId' => $elevator->installer_company_id,
            'status' => $elevator->status,
            'createdAt' => $elevator->created_at?->toIso8601String(),
            'updatedAt' => $elevator->updated_at?->toIso8601String(),
        ];
    }

    private function transformElevatorDetails(Elevator $elevator): array
    {
        $base = $this->transformElevator($elevator);

        $base['parts'] = $elevator->parts->map(function (Part $part) use ($elevator) {
            $pivot = $part->pivot;
            return [
                'id' => $pivot?->id,
                'elevatorId' => $elevator->id,
                'partId' => $part->id,
                'installedAt' => $pivot?->installed_at
                    ? Carbon::parse($pivot->installed_at)->toIso8601String()
                    : null,
                'removedAt' => $pivot?->removed_at
                    ? Carbon::parse($pivot->removed_at)->toIso8601String()
                    : null,
                'installerCompanyId' => $pivot?->installer_company_id,
                'part' => $this->transformPartSummary($part),
            ];
        })->values();

        return $base;
    }

    private function transformPartSummary(Part $part): array
    {
        return [
            'id' => $part->id,
            'partUid' => $part->part_uid,
            'title' => $part->title,
            'categoryId' => $part->category_id,
        ];
    }
}
