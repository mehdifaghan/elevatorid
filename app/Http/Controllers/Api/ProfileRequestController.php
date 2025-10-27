<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\ProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $profileIds = $user->profiles()->pluck('id');

        $page = max(1, (int) $request->input('page', 1));
        $size = max(1, min(100, (int) $request->input('size', 15)));

        $query = ProfileRequest::query()
            ->whereIn('profile_id', $profileIds)
            ->orderByDesc('created_at');

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $total = (clone $query)->count();
        $items = $query->forPage($page, $size)->get();

        return response()->json([
            'items' => $items->map(fn (ProfileRequest $requestItem) => $this->transform($requestItem)),
            'pagination' => [
                'page' => $page,
                'size' => $size,
                'total' => $total,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $this->resolveProfile($user, $request->input('profileId'));

        $validated = $request->validate([
            'type' => ['required', 'in:activation,upgrade'],
            'requestedProfileType' => ['nullable', 'in:producer,importer,installer,seller,coop_org'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $profileRequest = ProfileRequest::query()->create([
            'profile_id' => $profile->id,
            'type' => $validated['type'],
            'current_profile_type' => $profile->profile_type,
            'requested_profile_type' => $validated['requestedProfileType'] ?? null,
            'status' => 'pending',
            'note' => $validated['note'] ?? null,
        ]);

        return response()->json($this->transform($profileRequest), 201);
    }

    private function resolveProfile($user, $profileId): Profile
    {
        if ($profileId) {
            return $user->profiles()->where('profiles.id', $profileId)->firstOrFail();
        }

        $profile = $user->profiles()->where('is_active', true)->first();

        if (! $profile) {
            $profile = $user->profiles()->first();
        }

        abort_if(! $profile, 422, 'No profile found for current user.');

        return $profile;
    }

    private function transform(ProfileRequest $request): array
    {
        return [
            'id' => $request->id,
            'type' => $request->type,
            'profileId' => $request->profile_id,
            'currentProfileType' => $request->current_profile_type,
            'requestedProfileType' => $request->requested_profile_type,
            'status' => $request->status,
            'reviewerUserId' => $request->reviewer_user_id,
            'rejectReason' => $request->reject_reason,
            'note' => $request->note,
            'createdAt' => $request->created_at?->toIso8601String(),
            'updatedAt' => $request->updated_at?->toIso8601String(),
        ];
    }
}
