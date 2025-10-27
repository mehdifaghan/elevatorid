<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => (string) $user->id,
            'username' => $user->name ?? $user->phone,
            'email' => $user->email,
            'mobile' => $user->phone,
            'role' => 'administrator',
            'createdAt' => $user->created_at?->toIso8601String(),
            'lastLogin' => $user->updated_at?->toIso8601String(),
            'isActive' => $user->status === 'active',
        ]);
    }

    public function activityLogs(Request $request): JsonResponse
    {
        $logs = ActivityLog::query()
            ->where('user_id', $request->user()->id)
            ->where('scope', 'admin')
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
                    'ip' => Arr::get($meta, 'ip', '-'),
                    'userAgent' => Arr::get($meta, 'user_agent', '-'),
                ];
            });

        return response()->json([
            'logs' => $logs,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'mobile' => [
                'required',
                'regex:/^09\d{9}$/',
                Rule::unique('users', 'phone')->ignore($user->id),
            ],
        ]);

        $user->forceFill([
            'name' => $validated['username'],
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['mobile'],
        ])->save();

        $this->logActivity($user->id, 'update_admin_profile', 'اطلاعات حساب کاربری مدیر به‌روزرسانی شد.', $request);

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
        }

        $validated = $request->validate($rules);

        if ($user->password && ! Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json([
                'message' => 'رمز عبور فعلی اشتباه است.',
            ], 422);
        }

        $user->forceFill([
            'password' => Hash::make($validated['newPassword']),
        ])->save();

        $this->logActivity($user->id, 'change_admin_password', 'رمز عبور مدیر تغییر کرد.', $request);

        return response()->json([
            'success' => true,
            'message' => 'رمز عبور جدید با موفقیت ذخیره شد.',
        ]);
    }

    private function logActivity(int $userId, string $action, string $description, Request $request): void
    {
        ActivityLog::query()->create([
            'user_id' => $userId,
            'scope' => 'admin',
            'action' => $action,
            'description' => $description,
            'meta' => [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
        ]);
    }
}
