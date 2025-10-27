<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Profile;
use App\Models\ProfileDocument;
use App\Models\User;
use App\Services\AuthTokenService;
use App\Services\CaptchaService;
use App\Services\OtpService;
use App\Services\SmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use RuntimeException;

class AuthController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
        private readonly CaptchaService $captchaService,
        private readonly AuthTokenService $authTokenService,
        private readonly SmsService $smsService,
    ) {
    }

    public function sendOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'regex:/^09\d{9}$/'],
            'captchaId' => ['required', 'string'],
            'captcha' => ['required', 'regex:/^\d{4}$/'],
        ]);

        if (! $this->captchaService->validate($validated['captchaId'], $validated['captcha'])) {
            throw ValidationException::withMessages([
                'captcha' => ['Invalid captcha value.'],
            ]);
        }

        try {
            $this->otpService->ensureCanSend($validated['phone'], (string) $request->ip());
        } catch (RuntimeException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $otp = $this->otpService->generate($validated['phone']);

        if (app()->environment('local', 'testing')) {
            Log::debug('OTP code generated', ['phone' => $validated['phone'], 'code' => $otp]);
        } else {
            Log::info('OTP code generated', ['phone' => $validated['phone']]);
        }

        $message = sprintf("کد تایید شما: %s\nلغو 11", $otp);

        try {
            $log = $this->smsService->sendOtp(
                $validated['phone'],
                $message,
                (string) $request->ip(),
                [
                    'user_agent' => $request->userAgent(),
                ]
            );

            $this->otpService->attachLog($validated['phone'], $log);
        } catch (RuntimeException $exception) {
            Log::error('OTP SMS dispatch failed.', [
                'phone' => $validated['phone'],
                'exception' => $exception->getMessage(),
            ]);

            $this->otpService->clear($validated['phone']);

            return response()->json([
                'success' => false,
                'message' => 'ارسال پیامک با خطا مواجه شد.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json([
            'success' => true,
            'message' => 'کد تأیید ارسال شد.',
            'ttl' => (int) config('sms.otp.ttl_seconds', 120),
            'retryAfter' => (int) config('sms.otp.rate_limits.cooldown_seconds', 90),
        ]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'regex:/^09\d{9}$/'],
            'code' => ['required', 'digits:6'],
        ]);

        if (! $this->otpService->verify($validated['phone'], $validated['code'])) {
            throw ValidationException::withMessages([
                'code' => ['The provided code is invalid or has expired.'],
            ]);
        }

        /** @var User $user */
        $user = DB::transaction(function () use ($validated) {
            $user = User::query()->firstOrCreate(
                ['phone' => $validated['phone']],
                [
                    'name' => 'User '.$validated['phone'],
                    'status' => 'active',
                ]
            );

            if ($user->wasRecentlyCreated) {
                $user->forceFill([
                    'email' => null,
                ])->save();
            }

            $profile = $user->profiles()->with('company')->first();

            if (! $profile) {
                $company = Company::query()->create($this->defaultCompanyData());

                $profile = $user->profiles()->create([
                    'company_id' => $company->id,
                    'profile_type' => 'producer',
                    'is_active' => true,
                ]);
            } elseif (! $profile->company()->exists()) {
                $company = Company::query()->create($this->defaultCompanyData());
                $profile->company()->associate($company)->save();
            }

            return $user->load('profiles.company');
        });

        $tokenPair = $this->authTokenService->issue($user, (string) $request->ip(), $request->userAgent());

        return response()->json([
            'accessToken' => $tokenPair['access_token'],
            'refreshToken' => $tokenPair['refresh_token'],
            'expiresIn' => $tokenPair['expires_in'],
        ]);
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $refreshToken = $request->bearerToken();

        if (! $refreshToken) {
            return response()->json([
                'message' => 'Refresh token missing.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $tokenPair = $this->authTokenService->rotate($refreshToken, (string) $request->ip(), $request->userAgent());

        if (! $tokenPair) {
            return response()->json([
                'message' => 'Refresh token is invalid or expired.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return response()->json([
            'accessToken' => $tokenPair['access_token'],
            'refreshToken' => $tokenPair['refresh_token'],
            'expiresIn' => $tokenPair['expires_in'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user) {
            $request->user()?->currentAccessToken()?->delete();
            $this->authTokenService->revokeUserRefreshTokens($user);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user()->loadMissing('profiles.company');

        return response()->json($this->formatUserResponse($user));
    }

    public function updateMe(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user()->loadMissing('profiles.company');

        $validated = $request->validate([
            'profileType' => ['nullable', 'in:producer,importer,installer,seller,coop_org'],
            'company' => ['nullable', 'array'],
            'company.name' => ['nullable', 'string', 'max:255'],
            'company.tradeId' => ['nullable', 'string', 'max:100'],
            'company.province' => ['nullable', 'string', 'max:100'],
            'company.city' => ['nullable', 'string', 'max:100'],
            'company.address' => ['nullable', 'string', 'max:500'],
            'company.postalCode' => ['nullable', 'string', 'max:20'],
            'company.ceoPhone' => ['nullable', 'string', 'max:20'],
            'company.email' => ['nullable', 'string', 'email', 'max:255'],
        ]);

        $profile = $user->profiles()->with('company')->first() ?? $user->profiles()->create([
            'profile_type' => $validated['profileType'] ?? 'producer',
            'is_active' => true,
        ]);

        if (! empty($validated['profileType'])) {
            $profile->profile_type = $validated['profileType'];
        }

        if (! empty($validated['company'])) {
            $companyData = [
                'name' => $validated['company']['name'] ?? null,
                'trade_id' => $validated['company']['tradeId'] ?? null,
                'province' => $validated['company']['province'] ?? null,
                'city' => $validated['company']['city'] ?? null,
                'address' => $validated['company']['address'] ?? null,
                'postal_code' => $validated['company']['postalCode'] ?? null,
                'ceo_phone' => $validated['company']['ceoPhone'] ?? null,
                'email' => $validated['company']['email'] ?? null,
            ];

            $company = $profile->company;

            if ($company) {
                $company->fill($companyData)->save();
            } else {
                $company = Company::query()->create($companyData);
                $profile->company()->associate($company);
            }
        }

        $profile->save();

        return response()->json($this->formatUserResponse($user->fresh('profiles.company')));
    }

    public function uploadProfileDocument(Profile $profile, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($profile->user_id !== $user->id) {
            abort(Response::HTTP_FORBIDDEN, 'You are not allowed to manage this profile.');
        }

        $validated = $request->validate([
            'docType' => ['required', 'string', 'max:100'],
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $file = $request->file('file');

        if (! $file) {
            throw ValidationException::withMessages([
                'file' => ['No file was uploaded.'],
            ]);
        }
        $filename = sprintf(
            '%s-%s.%s',
            now()->format('YmdHis'),
            uniqid(),
            $file->getClientOriginalExtension()
        );
        $path = $file->storeAs("profile-documents/{$profile->id}", $filename, 'public');

        /** @var ProfileDocument $document */
        $document = $profile->documents()->create([
            'doc_type' => $validated['docType'],
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully.',
            'document' => [
                'id' => $document->id,
                'docType' => $document->doc_type,
                'filePath' => Storage::disk('public')->url($document->file_path),
                'uploadedAt' => $document->created_at,
            ],
        ], Response::HTTP_CREATED);
    }

    private function defaultCompanyData(): array
    {
        return [
            'name' => 'Unassigned Company',
            'trade_id' => null,
            'province' => null,
            'city' => null,
            'address' => null,
            'postal_code' => null,
            'ceo_phone' => null,
            'email' => null,
        ];
    }

    private function formatUserResponse(User $user): array
    {
        $user->loadMissing('profiles.company');

        return [
            'user' => [
                'id' => $user->id,
                'phone' => $user->phone,
                'email' => $user->email,
                'status' => $user->status,
            ],
            'profiles' => $user->profiles->map(function (Profile $profile) {
                $company = $profile->company;

                return [
                    'id' => $profile->id,
                    'profileType' => $profile->profile_type,
                    'isActive' => $profile->is_active,
                    'company' => $company ? [
                        'id' => $company->id,
                        'name' => $company->name,
                        'tradeId' => $company->trade_id,
                        'province' => $company->province,
                        'city' => $company->city,
                        'address' => $company->address,
                        'postalCode' => $company->postal_code,
                        'ceoPhone' => $company->ceo_phone,
                        'email' => $company->email,
                    ] : null,
                ];
            })->values()->all(),
        ];
    }
}
