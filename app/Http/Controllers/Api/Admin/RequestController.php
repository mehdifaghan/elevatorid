<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\ProfileRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class RequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->input('page', 1));
        $size = max(1, min(100, (int) $request->input('size', 15)));

        $query = ProfileRequest::query()
            ->with(['profile.user', 'profile.company'])
            ->orderByDesc('created_at');

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = trim((string) $request->input('q', ''))) {
            $query->where(function (Builder $builder) use ($search) {
                $builder->where('note', 'like', "%{$search}%")
                    ->orWhereHas('profile.user', function (Builder $q) use ($search) {
                        $q->where('phone', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('profile.company', function (Builder $q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $total = (clone $query)->count();
        $requests = $query->forPage($page, $size)->get();

        return response()->json([
            'items' => $requests->map(fn (ProfileRequest $item) => $this->transform($item)),
            'pagination' => [
                'page' => $page,
                'size' => $size,
                'total' => $total,
            ],
        ]);
    }

    public function stats(): JsonResponse
    {
        $baseQuery = ProfileRequest::query();

        $total = (clone $baseQuery)->count();
        $pending = (clone $baseQuery)->where('status', 'pending')->count();
        $approved = (clone $baseQuery)->where('status', 'approved')->count();
        $rejected = (clone $baseQuery)->where('status', 'rejected')->count();
        $inReview = (clone $baseQuery)->where('status', 'in_review')->count();

        return response()->json([
            'stats' => [
                'total' => $total,
                'pending' => $pending,
                'approved' => $approved,
                'rejected' => $rejected,
                'in_review' => $inReview,
            ],
        ]);
    }

    public function approve(int $id, Request $request): JsonResponse
    {
        $profileRequest = ProfileRequest::query()->with('profile')->findOrFail($id);

        DB::transaction(function () use ($profileRequest, $request) {
            $profileRequest->status = 'approved';
            $profileRequest->reviewer_user_id = $request->user()->id;
            $profileRequest->reject_reason = null;
            $profileRequest->save();

            if ($profileRequest->profile && $profileRequest->requested_profile_type) {
                /** @var Profile $profile */
                $profile = $profileRequest->profile;
                $profile->profile_type = $profileRequest->requested_profile_type;
                $profile->is_active = true;
                $profile->save();
            }
        });

        return response()->json($this->transform($profileRequest->fresh(['profile.user', 'profile.company'])));
    }

    public function respond(int $id, Request $request): JsonResponse
    {
        $profileRequest = ProfileRequest::query()->with('profile')->findOrFail($id);

        $validated = $request->validate([
            'action' => ['required', Rule::in(['approve', 'reject'])],
            'response' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($profileRequest, $validated, $request) {
            $profileRequest->status = $validated['action'] === 'approve' ? 'approved' : 'rejected';
            $profileRequest->reviewer_user_id = $request->user()->id;
            $profileRequest->reject_reason = $validated['action'] === 'reject'
                ? $validated['response']
                : null;

            $meta = $profileRequest->meta ?? [];
            $meta['adminResponse'] = $validated['response'] ?? null;
            $profileRequest->meta = $meta;

            $profileRequest->save();

            if (
                $validated['action'] === 'approve' &&
                $profileRequest->profile &&
                $profileRequest->requested_profile_type
            ) {
                /** @var Profile $profile */
                $profile = $profileRequest->profile;
                $profile->profile_type = $profileRequest->requested_profile_type;
                $profile->is_active = true;
                $profile->save();
            }
        });

        return response()->json($this->transform($profileRequest->fresh(['profile.user', 'profile.company'])));
    }

    private function transform(ProfileRequest $request): array
    {
        $meta = $request->meta ?? [];
        $profile = $request->profile;
        $company = $profile?->company;
        $user = $profile?->user;

        $uiType = Arr::get($meta, 'ui_type', $request->type ?? 'profile_update');

        return [
            'id' => (string) $request->id,
            'type' => $uiType,
            'title' => Arr::get($meta, 'title', 'درخواست کاربری'),
            'description' => $request->note ?? '',
            'companyId' => $company ? (string) $company->id : '',
            'companyName' => $company?->name ?? '-',
            'submittedBy' => $user?->name ?? $user?->phone ?? '-',
            'submitDate' => $request->created_at?->toDateString(),
            'status' => $request->status,
            'priority' => Arr::get($meta, 'priority', 'medium'),
            'adminResponse' => Arr::get($meta, 'adminResponse') ?? $request->reject_reason,
            'responseDate' => $request->updated_at?->toIso8601String(),
            'attachments' => Arr::get($meta, 'attachments', []),
        ];
    }
}
