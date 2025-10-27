<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Elevator;
use App\Models\ElevatorMaintenanceLog;
use App\Models\Part;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class UserElevatorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $companyId = $this->companyId($request);

        $elevators = Elevator::query()
            ->with(['parts' => fn ($query) => $query->withPivot(['meta', 'installed_at'])])
            ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Elevator $elevator) => $this->transformElevator($elevator, $request))
            ->values();

        return response()->json([
            'elevators' => $elevators,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->companyId($request);

        if (! $companyId) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'ابتدا اطلاعات شرکت خود را تکمیل کنید.');
        }

        $validated = $request->validate([
            'buildingName' => ['required', 'string', 'max:255'],
            'buildingType' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'provinceId' => ['nullable', 'integer'],
            'provinceName' => ['nullable', 'string', 'max:255'],
            'cityId' => ['nullable', 'integer'],
            'cityName' => ['nullable', 'string', 'max:255'],
            'postalCode' => ['nullable', 'string', 'max:20'],
            'municipalRegion' => ['nullable', 'string', 'max:255'],
            'buildingPermit' => ['nullable', 'string', 'max:255'],
            'registrationPlate' => ['nullable', 'string', 'max:255'],
            'installationDate' => ['nullable', 'date'],
            'elevatorType' => ['nullable', 'string', 'max:255'],
            'capacity' => ['nullable', 'string', 'max:50'],
            'floors' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'ownerName' => ['nullable', 'string', 'max:255'],
            'ownerPhone' => ['nullable', 'string', 'max:50'],
            'ownerEmail' => ['nullable', 'email', 'max:255'],
            'managerName' => ['nullable', 'string', 'max:255'],
            'managerPhone' => ['nullable', 'string', 'max:50'],
            'managerCompany' => ['nullable', 'string', 'max:255'],
            'installerName' => ['nullable', 'string', 'max:255'],
            'installerPhone' => ['nullable', 'string', 'max:50'],
            'installerCompany' => ['nullable', 'string', 'max:255'],
            'installerLicense' => ['nullable', 'string', 'max:255'],
            'parts' => ['nullable', 'array'],
            'parts.*.partId' => ['required', 'integer', 'exists:parts,id'],
            'parts.*.installationDate' => ['nullable', 'date'],
            'parts.*.warrantyDuration' => ['nullable', 'string', 'max:100'],
            'parts.*.notes' => ['nullable', 'string'],
        ]);

        $meta = [
            'buildingName' => $validated['buildingName'],
            'buildingType' => $validated['buildingType'] ?? null,
            'installationDate' => $validated['installationDate'] ?? null,
            'elevatorType' => $validated['elevatorType'] ?? null,
            'capacity' => $validated['capacity'] ?? null,
            'floors' => $validated['floors'] ?? null,
            'description' => $validated['description'] ?? null,
            'owner' => [
                'name' => $validated['ownerName'] ?? null,
                'phone' => $validated['ownerPhone'] ?? null,
                'email' => $validated['ownerEmail'] ?? null,
            ],
            'manager' => [
                'name' => $validated['managerName'] ?? null,
                'phone' => $validated['managerPhone'] ?? null,
                'company' => $validated['managerCompany'] ?? null,
            ],
            'installer' => [
                'name' => $validated['installerName'] ?? null,
                'phone' => $validated['installerPhone'] ?? null,
                'company' => $validated['installerCompany'] ?? null,
                'license' => $validated['installerLicense'] ?? null,
            ],
            'provinceId' => $validated['provinceId'] ?? null,
            'provinceName' => $validated['provinceName'] ?? null,
            'cityId' => $validated['cityId'] ?? null,
            'cityName' => $validated['cityName'] ?? null,
        ];

        $elevator = Elevator::query()->create([
            'elevator_uid' => $this->generateElevatorUid(),
            'municipality_zone' => $validated['municipalRegion'] ?? null,
            'build_permit_no' => $validated['buildingPermit'] ?? null,
            'registry_plate' => $validated['registrationPlate'] ?? null,
            'province' => $validated['provinceName'] ?? null,
            'city' => $validated['cityName'] ?? null,
            'address' => $validated['address'],
            'postal_code' => $validated['postalCode'] ?? null,
            'installer_company_id' => $companyId,
            'status' => 'installing',
            'last_inspection_at' => null,
            'next_inspection_due_at' => null,
            'meta' => $meta,
        ]);

        $parts = $validated['parts'] ?? [];

        foreach ($parts as $partData) {
            $elevator->parts()->attach($partData['partId'], [
                'installer_company_id' => $companyId,
                'installed_at' => Arr::get($partData, 'installationDate')
                    ? Carbon::parse($partData['installationDate'])
                    : now(),
                'meta' => [
                    'warrantyDuration' => Arr::get($partData, 'warrantyDuration'),
                    'notes' => Arr::get($partData, 'notes'),
                    'status' => 'working',
                    'installationDate' => Arr::get($partData, 'installationDate'),
                ],
            ]);
        }

        $this->logActivity($request, 'create_elevator', 'آسانسور جدید توسط کاربر ثبت شد.', [
            'elevator_id' => $elevator->id,
        ]);

        return response()->json([
            'elevator' => $this->transformElevator($elevator->fresh('parts'), $request),
        ], Response::HTTP_CREATED);
    }

    public function changePart(Request $request, int $id): JsonResponse
    {
        $companyId = $this->companyId($request);

        $validated = $request->validate([
            'partId' => ['required', 'integer', 'exists:parts,id'],
            'newPartSerial' => ['nullable', 'string', 'max:255'],
            'reason' => ['nullable', 'string'],
        ]);

        $elevator = Elevator::query()
            ->with(['parts' => fn ($query) => $query->withPivot(['meta', 'installed_at'])])
            ->where('id', $id)
            ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
            ->firstOrFail();

        /** @var Part|null $part */
        $part = $elevator->parts->firstWhere('id', $validated['partId']);

        if (! $part) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'قطعه انتخاب‌شده به این آسانسور متصل نیست.');
        }

        $pivot = $part->pivot;
        $meta = $pivot->meta ?? [];

        $meta['lastChange'] = [
            'previousSerial' => $part->barcode,
            'newSerial' => $validated['newPartSerial'] ?? $part->barcode,
            'reason' => $validated['reason'] ?? null,
            'changed_at' => now()->toIso8601String(),
        ];

        DB::transaction(function () use ($pivot, $meta, $part, $validated) {
            $pivot->meta = $meta;
            $pivot->save();

            if (! empty($validated['newPartSerial'])) {
                $part->barcode = $validated['newPartSerial'];
                $part->save();
            }
        });

        $this->logActivity($request, 'change_elevator_part', 'یک قطعه در آسانسور کاربر تعویض شد.', [
            'elevator_id' => $elevator->id,
            'part_id' => $part->id,
        ]);

        return response()->json([
            'success' => true,
        ]);
    }

    public function maintenance(Request $request, int $id): JsonResponse
    {
        $companyId = $this->companyId($request);

        $validated = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'performedBy' => ['nullable', 'string', 'max:255'],
        ]);

        $elevator = Elevator::query()
            ->where('id', $id)
            ->when($companyId, fn ($query) => $query->where('installer_company_id', $companyId))
            ->firstOrFail();

        ElevatorMaintenanceLog::query()->create([
            'elevator_id' => $elevator->id,
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'description' => $validated['description'],
            'cost' => $validated['cost'] ?? null,
            'performed_by' => $validated['performedBy'] ?? null,
            'performed_at' => now(),
        ]);

        $this->logActivity($request, 'record_maintenance', 'عملیات نگهداری برای آسانسور ثبت شد.', [
            'elevator_id' => $elevator->id,
            'maintenance_type' => $validated['type'],
        ]);

        return response()->json([
            'success' => true,
        ]);
    }

    private function transformElevator(Elevator $elevator, Request $request): array
    {
        $meta = $elevator->meta ?? [];
        $company = $request->user()->profiles()->where('is_active', true)->first()?->company;

        return [
            'id' => (string) $elevator->id,
            'uid' => $elevator->elevator_uid,
            'buildingName' => Arr::get($meta, 'buildingName', $elevator->registry_plate ?? 'آسانسور'),
            'buildingType' => Arr::get($meta, 'buildingType', 'commercial'),
            'address' => $elevator->address ?? '',
            'province' => $elevator->province ?? Arr::get($meta, 'provinceName', ''),
            'city' => $elevator->city ?? Arr::get($meta, 'cityName', ''),
            'municipalRegion' => $elevator->municipality_zone ?? '',
            'postalCode' => $elevator->postal_code ?? '',
            'buildingPermit' => $elevator->build_permit_no ?? '',
            'registrationPlate' => $elevator->registry_plate ?? '',
            'installationDate' => Arr::get($meta, 'installationDate', $elevator->created_at?->toDateString()),
            'floors' => (int) Arr::get($meta, 'floors', 0),
            'capacity' => Arr::get($meta, 'capacity', ''),
            'motorType' => Arr::get($meta, 'motorType', 'unknown'),
            'status' => $elevator->status ?? 'active',
            'lastInspection' => $elevator->last_inspection_at?->toDateString() ?? Arr::get($meta, 'lastInspection'),
            'nextInspection' => $elevator->next_inspection_due_at?->toDateString() ?? Arr::get($meta, 'nextInspection'),
            'parts' => $elevator->parts->map(function (Part $part) {
                $pivotMeta = $part->pivot->meta ?? [];

                return [
                    'id' => (string) $part->id,
                    'name' => $part->title,
                    'brand' => $part->extra['brand'] ?? '',
                    'model' => $part->extra['model'] ?? '',
                    'serialNumber' => $part->barcode,
                    'installationDate' => $part->pivot->installed_at?->toDateString()
                        ?? Arr::get($pivotMeta, 'installationDate'),
                    'warrantyExpiry' => Arr::get($pivotMeta, 'warrantyDuration'),
                    'status' => Arr::get($pivotMeta, 'status', 'working'),
                ];
            })->values(),
            'owner' => Arr::get($meta, 'owner', [
                'name' => $company?->name ?? '',
                'phone' => $company?->ceo_phone ?? '',
                'email' => $company?->email ?? '',
            ]),
            'manager' => Arr::get($meta, 'manager', [
                'name' => $request->user()->name ?? '',
                'phone' => $request->user()->phone ?? '',
                'company' => $company?->name ?? '',
            ]),
            'installer' => Arr::get($meta, 'installer', [
                'name' => $company?->name ?? '',
                'phone' => $company?->ceo_phone ?? '',
                'company' => $company?->name ?? '',
                'license' => null,
            ]),
            'createdAt' => $elevator->created_at?->toIso8601String(),
            'updatedAt' => $elevator->updated_at?->toIso8601String(),
        ];
    }

    private function companyId(Request $request): ?int
    {
        return $request->user()
            ->profiles()
            ->where('is_active', true)
            ->first()?->company?->id;
    }

    private function generateElevatorUid(): string
    {
        do {
            $candidate = 'ELV-'.Str::upper(Str::random(8));
        } while (Elevator::query()->where('elevator_uid', $candidate)->exists());

        return $candidate;
    }

    private function logActivity(Request $request, string $action, string $description, array $meta = []): void
    {
        ActivityLog::query()->create([
            'user_id' => $request->user()->id,
            'scope' => 'user',
            'action' => $action,
            'description' => $description,
            'meta' => array_merge($meta, [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]),
        ]);
    }
}
