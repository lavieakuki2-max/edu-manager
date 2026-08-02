<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self)');
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');

        if ($request->isSecure() || $request->headers->get('X-Forwarded-Proto') === 'https') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Re-assert the Inertia header on JSON page responses so proxies/CDNs
        // cannot strip it and turn a valid Inertia payload into a "plain JSON"
        // response from the client's perspective.
        if ($request->header('X-Inertia') && $response->isOk()) {
            $contentType = $response->headers->get('Content-Type', '');
            if (str_contains($contentType, 'application/json')) {
                $response->headers->set('X-Inertia', 'true');
            }
        }

        // The Inertia middleware sets `Vary: X-Inertia`, which drops the
        // `Accept-Encoding` value. Without it, a gzipping reverse proxy may
        // cache and re-serve a representation without the X-Inertia header.
        $variants = array_filter(array_map('trim', explode(',', $response->headers->get('Vary', ''))));
        foreach (['X-Inertia', 'Accept-Encoding'] as $header) {
            if (! in_array($header, $variants, true)) {
                $variants[] = $header;
            }
        }
        if ($variants) {
            $response->headers->set('Vary', implode(', ', $variants));
        }

        return $response;
    }
}
