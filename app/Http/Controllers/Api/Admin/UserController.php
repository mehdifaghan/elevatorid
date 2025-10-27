<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->input('page', 1));
        $size = max(1, min(100, (int) $request->input('size', 15)));

        $query = User::query()->with(['profiles.company'])->orderByDesc('created_at');

        if ($search = trim((string) $request->input('q', ''))) {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('phone', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('profiles.company', function (Builder $q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $total = (clone $query)->count();
        $users = $query->forPage($page, $size)->get();

        return response()->json([
            'items' => $users->map(fn (User $user) => $this->formatSummary($user)),
            'pagination' => [
                'page' => $page,
                'size' => $size,
                'total' => $total,
            ],
        ]);
    }

    public function stats(): JsonResponse
    {
        $total = User::query()->count();
        $active = User::query()->where('status', 'active')->count();
        $pending = User::query()->where('status', 'pending')->count();
        $suspended = User::query()->where('status', 'suspended')->count();

        $thisMonth = User::query()
            ->whereBetween('created_at', [now()->copy()->startOfMonth(), now()])
            ->count();

        $lastMonthStart = now()->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = now()->copy()->subMonth()->endOfMonth();
        $lastMonth = User::query()
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->count();

        $monthlyGrowth = $lastMonth > 0
            ? round((($thisMonth - $lastMonth) / $lastMonth) * 100, 2)
            : ($thisMonth > 0 ? 100 : 0);

        return response()->json([
            'total' => $total,
            'active' => $active,
            'pending' => $pending,
            'suspended' => $suspended,
            'thisMonth' => $thisMonth,
            'lastMonth' => $lastMonth,
            'monthlyGrowth' => $monthlyGrowth,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::query()->with(['profiles.company'])->findOrFail($id);

        return response()->json($this->formatDetail($user));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'mobile' => ['required', 'regex:/^09\d{9}$/', 'unique:users,phone'],
            'profileTypes' => ['nullable', 'array'],
            'profileTypes.*' => ['in:producer,importer,installer,seller,coop_org'],
        ]);

        $profileTypes = $validated['profileTypes'] ?? ['producer'];

        /** @var User $user */
        $user = DB::transaction(function () use ($validated, $profileTypes) {
            $user = User::query()->create([
                'name' => $validated['name'] ?? 'User '.$validated['mobile'],
                'phone' => $validated['mobile'],
                'status' => 'pending',
            ]);

            $this->syncProfiles($user, $profileTypes);

            return $user->load('profiles.company');
        });

        return response()->json($this->formatDetail($user), Response::HTTP_CREATED);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $user = User::query()->with('profiles.company')->findOrFail($id);

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:pending,active,suspended'],
            'profileTypes' => ['nullable', 'array'],
            'profileTypes.*' => ['in:producer,importer,installer,seller,coop_org'],
            'permissions' => ['nullable', 'array'],
            'permissions.mgmtReports' => ['boolean'],
            'permissions.partsInquiry' => ['boolean'],
            'permissions.elevatorsInquiry' => ['boolean'],
            'permissions.transferApproval' => ['boolean'],
            'permissions.userManagement' => ['boolean'],
        ]);

        DB::transaction(function () use ($user, $validated) {
            if (! empty($validated['name'])) {
                $user->name = $validated['name'];
            }

            if (! empty($validated['status'])) {
                $user->status = $validated['status'];
            }

            $user->save();

            if (! empty($validated['profileTypes'])) {
                $this->syncProfiles($user, $validated['profileTypes']);
            }

            if (array_key_exists('permissions', $validated)) {
                $permissions = $validated['permissions'] ?? [];

                $primaryProfile = $user->profiles()->first();
                if ($primaryProfile) {
                    $meta = $primaryProfile->meta ?? [];
                    $meta['permissions'] = [
                        'mgmtReports' => (bool) ($permissions['mgmtReports'] ?? false),
                        'partsInquiry' => (bool) ($permissions['partsInquiry'] ?? false),
                        'elevatorsInquiry' => (bool) ($permissions['elevatorsInquiry'] ?? false),
                        'transferApproval' => (bool) ($permissions['transferApproval'] ?? false),
                        'userManagement' => (bool) ($permissions['userManagement'] ?? false),
                    ];
                    $primaryProfile->meta = $meta;
                    $primaryProfile->save();
                }
            }
        });

        return response()->json($this->formatDetail($user->fresh('profiles.company')));
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted.',
        ]);
    }

    public function sendSms(int $id, Request $request): JsonResponse
    {
        $user = User::query()->findOrFail($id);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:500'],
        ]);

        Log::info('SMS dispatch requested', [
            'user_id' => $user->id,
            'phone' => $user->phone,
            'body' => $validated['body'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'SMS queued for delivery.',
        ]);
    }

    public function export(): StreamedResponse
    {
        $filename = 'users-export-'.now()->format('Ymd-His').'.csv';

        $callback = function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Phone', 'Email', 'Status', 'Created At']);

            User::query()
                ->orderBy('id')
                ->chunk(100, function ($users) use ($handle) {
                    foreach ($users as $user) {
                        fputcsv($handle, [
                            $user->id,
                            $user->name,
                            $user->phone,
                            $user->email,
                            $user->status,
                            $user->created_at,
                        ]);
                    }
                });

            fclose($handle);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function syncProfiles(User $user, array $profileTypes): void
    {
        $profileTypes = collect($profileTypes)->unique()->values();

        $existingProfiles = $user->profiles()->get()->keyBy('profile_type');

        foreach ($profileTypes as $type) {
            /** @var Profile|null $profile */
            $profile = $existingProfiles->get($type);

            if (! $profile) {
                $user->profiles()->create([
                    'profile_type' => $type,
                    'is_active' => true,
                ]);
            } else {
                $profile->is_active = true;
                $profile->save();
            }
        }

        $user->profiles()
            ->whereNotIn('profile_type', $profileTypes->all())
            ->update(['is_active' => false]);
    }

    private function formatSummary(User $user): array
    {
        $primaryProfile = $user->profiles->first();

        return [
            'id' => $user->id,
            'companyName' => $primaryProfile?->company?->name,
            'phone' => $user->phone,
            'status' => $user->status,
            'profileTypes' => $user->profiles
                ->where('is_active', true)
                ->pluck('profile_type')
                ->unique()
                ->values(),
            'createdAt' => $user->created_at?->toIso8601String(),
            'lastActive' => $user->updated_at?->toIso8601String(),
        ];
    }

    private function formatDetail(User $user): array
    {
        $profiles = $user->profiles->map(function (Profile $profile) {
            return [
                'id' => $profile->id,
                'profileType' => $profile->profile_type,
                'isActive' => (bool) $profile->is_active,
                'permissions' => $profile->meta['permissions'] ?? null,
                'company' => $profile->company ? [
                    'id' => $profile->company->id,
                    'name' => $profile->company->name,
                    'province' => $profile->company->province,
                    'city' => $profile->company->city,
                ] : null,
            ];
        });

        $primaryProfile = $user->profiles->first();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'phone' => $user->phone,
            'status' => $user->status,
            'email' => $user->email,
            'createdAt' => $user->created_at?->toIso8601String(),
            'lastActive' => $user->updated_at?->toIso8601String(),
            'company' => $primaryProfile?->company ? [
                'id' => $primaryProfile->company->id,
                'name' => $primaryProfile->company->name,
                'province' => $primaryProfile->company->province,
                'city' => $primaryProfile->company->city,
                'address' => $primaryProfile->company->address,
                'postalCode' => $primaryProfile->company->postal_code,
                'tradeId' => $primaryProfile->company->trade_id,
            ] : null,
            'profiles' => $profiles,
        ];
    }
}
