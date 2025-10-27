<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Symfony\Component\HttpFoundation\Response;

class UserProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $profile = $this->resolveProfile($request);

        return response()->json($this->transformProfile($profile));
    }

    public function activityLogs(Request $request): JsonResponse
    {
        $logs = ActivityLog::query()
            ->where('user_id', $request->user()->id)
            ->where('scope', 'user')
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(function (ActivityLog $log) {
                $meta = $log->meta ?? [];

                return [
                    'id' => (string) $log->id,
                    'action' => $log->action,
                    'details' => $log->description ?? '-',
                    'timestamp' => $log->created_at?->toIso8601String(),
                    'ip' => Arr::get($meta, 'ip') ?? Arr::get($meta, 'ip_address') ?? '-',
                    'userAgent' => Arr::get($meta, 'user_agent') ?? '-',
                ];
            });

        return response()->json([
            'logs' => $logs,
        ]);
    }

    public function updateBasic(Request $request): JsonResponse
    {
        $profile = $this->resolveProfile($request);
        $user = $request->user();

        $validated = $request->validate([
            'managerName' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'mobile' => [
                'required',
                'regex:/^09\d{9}$/',
                Rule::unique('users', 'phone')->ignore($user->id),
            ],
        ]);

        $meta = $profile->meta ?? [];
        $meta['managerName'] = $validated['managerName'];
        $meta['mobile'] = $validated['mobile'];

        $profile->meta = $meta;
        $profile->save();

        $user->forceFill([
            'name' => $validated['managerName'],
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['mobile'],
        ])->save();

        $this->logActivity($user->id, 'update_basic_profile', 'اطلاعات عمومی پروفایل به‌روزرسانی شد.');

        return $this->show($request);
    }

    public function updateCompany(Request $request): JsonResponse
    {
        $profile = $this->resolveProfile($request);
        $company = $profile->company;

        $validated = $request->validate([
            'companyName' => ['required', 'string', 'max:255'],
            'companyCode' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['required', 'string'],
            'provinceId' => ['required', 'integer', 'min:1'],
            'cityId' => ['required', 'integer', 'min:1'],
            'postalCode' => ['nullable', 'string', 'max:20'],
            'nationalCode' => ['nullable', 'string', 'max:50'],
            'economicCode' => ['nullable', 'string', 'max:50'],
            'registrationNumber' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'provinceName' => ['nullable', 'string', 'max:255'],
            'cityName' => ['nullable', 'string', 'max:255'],
        ]);

        if (! $company) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'Company profile is missing.');
        }

        $company->fill([
            'name' => $validated['companyName'],
            'trade_id' => $validated['companyCode'] ?? $company->trade_id,
            'address' => $validated['address'],
            'province' => $validated['provinceName'] ?? $company->province,
            'city' => $validated['cityName'] ?? $company->city,
            'postal_code' => $validated['postalCode'] ?? $company->postal_code,
            'ceo_phone' => $validated['phone'] ?? $company->ceo_phone,
        ])->save();

        $meta = $profile->meta ?? [];
        $meta['provinceId'] = (int) $validated['provinceId'];
        $meta['provinceName'] = $validated['provinceName'] ?? $company->province;
        $meta['cityId'] = (int) $validated['cityId'];
        $meta['cityName'] = $validated['cityName'] ?? $company->city;
        $meta['nationalCode'] = $validated['nationalCode'] ?? null;
        $meta['economicCode'] = $validated['economicCode'] ?? null;
        $meta['registrationNumber'] = $validated['registrationNumber'] ?? null;
        $meta['website'] = $validated['website'] ?? null;
        $meta['description'] = $validated['description'] ?? null;
        $meta['companyPhone'] = $validated['phone'] ?? $company->ceo_phone;

        $profile->meta = $meta;
        $profile->save();

        $this->logActivity($request->user()->id, 'update_company_profile', 'اطلاعات شرکت کاربر به‌روزرسانی شد.');

        return $this->show($request);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $rules = [
            'newPassword' => ['required', Password::min(8)->mixedCase()->numbers()],
        ];

        if ($user->password) {
            $rules['currentPassword'] = ['required', 'string'];
        } else {
            $rules['currentPassword'] = ['nullable', 'string'];
        }

        $validated = $request->validate($rules);

        if ($user->password && ! Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json([
                'message' => 'رمز عبور فعلی اشتباه است.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->forceFill([
            'password' => Hash::make($validated['newPassword']),
        ])->save();

        $this->logActivity($user->id, 'change_password', 'رمز عبور کاربر تغییر یافت.', [
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'رمز عبور با موفقیت به‌روزرسانی شد.',
        ]);
    }

    public function check(Request $request): JsonResponse
    {
        $profile = $this->resolveProfile($request);
        $company = $profile->company;
        $meta = $profile->meta ?? [];
        $user = $request->user();

        $missing = [];

        if (! $company || blank($company->name)) {
            $missing[] = 'companyName';
        }

        if (! ($meta['managerName'] ?? $user->name)) {
            $missing[] = 'managerName';
        }

        if (! ($meta['mobile'] ?? $user->phone)) {
            $missing[] = 'mobile';
        }

        if (! $company || blank($company->trade_id)) {
            $missing[] = 'companyCode';
        }

        if (! $company || blank($company->address)) {
            $missing[] = 'address';
        }

        if (! ($meta['provinceId'] ?? null)) {
            $missing[] = 'provinceId';
        }

        if (! ($meta['cityId'] ?? null)) {
            $missing[] = 'cityId';
        }

        return response()->json([
            'isComplete' => empty($missing),
            'missingFields' => $missing,
        ]);
    }

    private function resolveProfile(Request $request): Profile
    {
        /** @var \App\Models\User $user */
        $user = $request->user()->loadMissing('profiles.company');

        $profile = $user->profiles()
            ->with('company', 'user')
            ->where('is_active', true)
            ->first();

        if (! $profile) {
            $profile = $user->profiles()->with('company', 'user')->first();
        }

        abort_if(! $profile, Response::HTTP_UNPROCESSABLE_ENTITY, 'No profile found for current user.');

        return $profile;
    }

    private function transformProfile(Profile $profile): array
    {
        $profile->loadMissing('company', 'user');

        $user = $profile->user;
        $company = $profile->company;
        $meta = $profile->meta ?? [];

        return [
            'id' => (string) $profile->id,
            'companyName' => $company?->name ?? '',
            'companyCode' => $company?->trade_id ?? '',
            'managerName' => $meta['managerName'] ?? $user?->name ?? '',
            'email' => $user?->email ?? '',
            'mobile' => $meta['mobile'] ?? $user?->phone ?? '',
            'phone' => $meta['companyPhone'] ?? $company?->ceo_phone ?? '',
            'address' => $company?->address ?? '',
            'provinceId' => (int) ($meta['provinceId'] ?? 0),
            'provinceName' => $meta['provinceName'] ?? ($company?->province ?? ''),
            'cityId' => (int) ($meta['cityId'] ?? 0),
            'cityName' => $meta['cityName'] ?? ($company?->city ?? ''),
            'postalCode' => $company?->postal_code ?? '',
            'nationalCode' => $meta['nationalCode'] ?? '',
            'economicCode' => $meta['economicCode'] ?? '',
            'registrationNumber' => $meta['registrationNumber'] ?? '',
            'website' => $meta['website'] ?? '',
            'description' => $meta['description'] ?? '',
            'isActive' => (bool) $profile->is_active,
            'createdAt' => $profile->created_at?->toIso8601String(),
            'lastLogin' => $meta['lastLogin'] ?? null,
        ];
    }

    private function logActivity(int $userId, string $action, string $description, array $meta = []): void
    {
        ActivityLog::query()->create([
            'user_id' => $userId,
            'scope' => 'user',
            'action' => $action,
            'description' => $description,
            'meta' => $meta,
        ]);
    }
}
