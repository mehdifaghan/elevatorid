<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $profileIds = $user->profiles()->pluck('id');

        $page = max(1, (int) $request->input('page', 1));
        $size = max(1, min(100, (int) $request->input('size', 15)));

        $query = Complaint::query()
            ->whereIn('profile_id', $profileIds)
            ->orderByDesc('created_at');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $total = (clone $query)->count();
        $items = $query->forPage($page, $size)->get();

        return response()->json([
            'items' => $items->map(fn (Complaint $complaint) => $this->transform($complaint)),
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
        $profile = $user->profiles()->where('is_active', true)->first() ?? $user->profiles()->first();

        abort_if(! $profile, 422, 'No profile found for current user.');

        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $complaint = Complaint::query()->create([
            'profile_id' => $profile->id,
            'subject' => $validated['subject'],
            'body' => $validated['body'],
            'status' => 'pending',
        ]);

        return response()->json($this->transform($complaint), 201);
    }

    private function transform(Complaint $complaint): array
    {
        return [
            'id' => $complaint->id,
            'profileId' => $complaint->profile_id,
            'subject' => $complaint->subject,
            'body' => $complaint->body,
            'status' => $complaint->status,
            'adminNotes' => $complaint->admin_notes,
            'createdAt' => $complaint->created_at?->toIso8601String(),
        ];
    }
}
