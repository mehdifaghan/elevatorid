<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\UserSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserSettingsController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        return response()->json([
            'notifications' => $settings->notifications ?? [
                'email' => false,
                'sms' => false,
                'push' => false,
                'transferUpdates' => false,
                'requestResponses' => false,
                'systemAlerts' => false,
            ],
            'privacy' => $settings->privacy ?? [
                'profileVisibility' => 'private',
                'showEmail' => false,
                'showPhone' => false,
                'allowDataExport' => false,
            ],
            'display' => $settings->display ?? [
                'language' => 'fa',
                'timezone' => 'Asia/Tehran',
                'dateFormat' => 'persian',
                'theme' => 'system',
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $data = $request->validate([
            'notifications' => ['nullable', 'array'],
            'privacy' => ['nullable', 'array'],
            'display' => ['nullable', 'array'],
        ]);

        $settings->fill([
            'notifications' => $data['notifications'] ?? $settings->notifications,
            'privacy' => $data['privacy'] ?? $settings->privacy,
            'display' => $data['display'] ?? $settings->display,
        ])->save();

        ActivityLog::query()->create([
            'user_id' => $request->user()->id,
            'scope' => 'user',
            'action' => 'update_settings',
            'description' => 'تنظیمات حساب کاربری به‌روزرسانی شد.',
        ]);

        return $this->show($request);
    }

    public function updateNotifications(Request $request): JsonResponse
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $data = $request->validate([
            'email' => ['required', 'boolean'],
            'sms' => ['required', 'boolean'],
            'push' => ['required', 'boolean'],
            'transferUpdates' => ['required', 'boolean'],
            'requestResponses' => ['required', 'boolean'],
            'systemAlerts' => ['required', 'boolean'],
        ]);

        $settings->notifications = $data;
        $settings->save();

        return response()->json(['success' => true]);
    }

    public function updatePrivacy(Request $request): JsonResponse
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $data = $request->validate([
            'profileVisibility' => ['required', 'in:public,private,limited'],
            'showEmail' => ['required', 'boolean'],
            'showPhone' => ['required', 'boolean'],
            'allowDataExport' => ['required', 'boolean'],
        ]);

        $settings->privacy = $data;
        $settings->save();

        return response()->json(['success' => true]);
    }

    public function updateDisplay(Request $request): JsonResponse
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $data = $request->validate([
            'language' => ['required', 'string', 'max:10'],
            'timezone' => ['required', 'string', 'max:50'],
            'dateFormat' => ['required', 'string', 'max:20'],
            'theme' => ['required', 'in:light,dark,system'],
        ]);

        $settings->display = $data;
        $settings->save();

        return response()->json(['success' => true]);
    }

    private function getOrCreateSettings(int $userId): UserSetting
    {
        return UserSetting::query()->firstOrCreate(
            ['user_id' => $userId],
            [
                'notifications' => null,
                'privacy' => null,
                'display' => null,
            ]
        );
    }
}
