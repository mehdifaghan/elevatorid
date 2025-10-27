<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $hasAdminProfile = $user
            ? $user->profiles()
                ->where('profile_type', 'coop_org')
                ->where('is_active', true)
                ->exists()
            : false;

        if (! $user || ! $hasAdminProfile) {
            abort(Response::HTTP_FORBIDDEN, 'Administrator access required.');
        }

        return $next($request);
    }
}
