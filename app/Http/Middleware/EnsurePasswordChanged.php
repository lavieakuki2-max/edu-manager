<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    /**
     * Redirect users who still have to change their password to the forced
     * password change page, except for the auth/password routes themselves.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->must_change_password) {
            $routeName = $request->route()?->getName();

            $isAllowed = $routeName && (
                str_starts_with($routeName, 'password') ||
                in_array($routeName, ['login', 'logout'], true)
            );

            if (! $isAllowed) {
                return redirect()->route('password.force');
            }
        }

        return $next($request);
    }
}
