<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Complaint;
use App\Models\Profile;
use App\Models\ProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class UserRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $profileIds = $this->profileIds($request);

        $profileRequests = ProfileRequest::query()
            ->with(['profile.company', 'profile.user'])
            ->whereIn('profile_id', $profileIds)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (ProfileRequest $item) => $this->transformProfileRequest($item));

        $complaints = Complaint::query()
            ->with(['profile.company', 'profile.user'])
            ->whereIn('profile_id', $profileIds)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Complaint $complaint) => $this->transformComplaint($complaint));

        $items = $profileRequests
            ->merge($complaints)
            ->sortByDesc('submitDate')
            ->values();

        return response()->json([
            'requests' => $items,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $profile = $this->resolveProfile($request);

        $validated = $request->validate([
            'type' => ['required', Rule::in(['profile_update', 'part_change', 'complaint', 'support'])],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high', 'urgent'])],
        ]);

        $priority = $validated['priority'] ?? 'medium';

        if ($validated['type'] === 'complaint') {
            $complaint = Complaint::query()->create([
                'profile_id' => $profile->id,
                'subject' => $validated['title'],
                'body' => $validated['description'],
                'status' => 'pending',
                'meta' => [
                    'priority' => $priority,
                    'title' => $validated['title'],
                ],
            ]);

            $this->logActivity($request, 'create_complaint_request', 'ثبت شکایت جدید توسط کاربر.', [
                'complaint_id' => $complaint->id,
            ]);

            return response()->json([
                'request' => $this->transformComplaint($complaint->fresh(['profile.company', 'profile.user'])),
            ], Response::HTTP_CREATED);
        }

        $type = $this->mapUiTypeToRequestType($validated['type']);

        $profileRequest = ProfileRequest::query()->create([
            'profile_id' => $profile->id,
            'type' => $type,
            'current_profile_type' => $profile->profile_type,
            'requested_profile_type' => $profile->profile_type,
            'status' => 'pending',
            'note' => $validated['description'],
            'meta' => [
                'title' => $validated['title'],
                'priority' => $priority,
                'ui_type' => $validated['type'],
            ],
        ]);

        $this->logActivity($request, 'create_profile_request', 'درخواست کاربری جدید ثبت شد.', [
            'profile_request_id' => $profileRequest->id,
            'ui_type' => $validated['type'],
        ]);

        return response()->json([
            'request' => $this->transformProfileRequest($profileRequest->fresh(['profile.company', 'profile.user'])),
        ], Response::HTTP_CREATED);
    }

    private function resolveProfile(Request $request): Profile
    {
        /** @var \App\Models\User $user */
        $user = $request->user()->loadMissing('profiles.company');

        $profile = $user->profiles()
            ->with('company')
            ->where('is_active', true)
            ->first();

        if (! $profile) {
            $profile = $user->profiles()->with('company')->first();
        }

        abort_if(! $profile, Response::HTTP_UNPROCESSABLE_ENTITY, 'هیچ پروفایلی برای کاربر یافت نشد.');

        return $profile;
    }

    private function profileIds(Request $request): Collection
    {
        return $request->user()
            ->profiles()
            ->pluck('id');
    }

    private function transformProfileRequest(ProfileRequest $request): array
    {
        $meta = $request->meta ?? [];
        $profile = $request->profile;
        $company = $profile?->company;
        $user = $profile?->user;

        $uiType = Arr::get($meta, 'ui_type', 'profile_update');

        return [
            'id' => 'profile-'.$request->id,
            'type' => $uiType,
            'title' => Arr::get($meta, 'title') ?? 'درخواست کاربری',
            'description' => $request->note ?? '',
            'companyId' => $company ? (string) $company->id : '',
            'companyName' => $company?->name ?? '-',
            'submittedBy' => $user?->name ?? $user?->phone ?? '-',
            'submitDate' => $request->created_at?->toDateString(),
            'status' => $this->mapStatus($request->status),
            'priority' => Arr::get($meta, 'priority', 'medium'),
            'adminResponse' => $request->reject_reason,
            'responseDate' => $request->updated_at?->toIso8601String(),
            'attachments' => Arr::get($meta, 'attachments', []),
        ];
    }

    private function transformComplaint(Complaint $complaint): array
    {
        $meta = $complaint->meta ?? [];
        $profile = $complaint->profile;
        $company = $profile?->company;
        $user = $profile?->user;

        return [
            'id' => 'complaint-'.$complaint->id,
            'type' => 'complaint',
            'title' => Arr::get($meta, 'title', $complaint->subject),
            'description' => $complaint->body,
            'companyId' => $company ? (string) $company->id : '',
            'companyName' => $company?->name ?? '-',
            'submittedBy' => $user?->name ?? $user?->phone ?? '-',
            'submitDate' => $complaint->created_at?->toDateString(),
            'status' => $this->mapComplaintStatus($complaint->status),
            'priority' => Arr::get($meta, 'priority', 'medium'),
            'adminResponse' => $complaint->admin_notes,
            'responseDate' => $complaint->updated_at?->toIso8601String(),
            'attachments' => Arr::get($meta, 'attachments', []),
        ];
    }

    private function mapStatus(string $status): string
    {
        return match ($status) {
            'pending' => 'pending',
            'approved' => 'approved',
            'rejected' => 'rejected',
            'in_review' => 'in_review',
            default => 'pending',
        };
    }

    private function mapComplaintStatus(string $status): string
    {
        return match ($status) {
            'pending' => 'pending',
            'in_review' => 'in_review',
            'resolved' => 'approved',
            'rejected' => 'rejected',
            default => 'pending',
        };
    }

    private function mapUiTypeToRequestType(string $uiType): string
    {
        return match ($uiType) {
            'profile_update' => 'upgrade',
            'part_change' => 'activation',
            'support' => 'upgrade',
            default => 'upgrade',
        };
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
