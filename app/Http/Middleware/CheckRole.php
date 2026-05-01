<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Stop users from opening workspaces that do not match their role.
        abort_unless(
            $request->user() && in_array($request->user()->role, $roles, true),
            403,
        );

        return $next($request);
    }
}
