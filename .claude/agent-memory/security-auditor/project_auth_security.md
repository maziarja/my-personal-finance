---
name: auth-security-audit-phase3-4
description: Security audit findings for auth layer (proxy.ts, layouts, authActions.ts, auth.ts) — Phase 3 & 4 implementation
metadata:
  type: project
---

Audit completed on Phase 3 (auth pages) and Phase 4 (app shell/navigation) code.

## Key findings recorded

**proxy.ts is the correct filename in Next.js 16** — confirmed by docs and compiled output. middleware.ts is deprecated; proxy.ts replaces it. The function must be named `proxy` (not `middleware`). This project's proxy.ts is correctly named and correctly uses `async function proxy`.

**proxy.ts IS running** — middleware.js in .next/dev/server/ references proxy.ts as INNER_MIDDLEWARE_MODULE. The code is compiled into the middleware bundle.

**middleware-manifest.json shows empty `middleware: {}`** — This is suspicious and warrants follow-up in production build. In dev (Turbopack) mode the manifest may be populated differently from production. Do not conclude proxy is not running based solely on the dev manifest; the compiled middleware.js file references proxy.ts.

**signOut Server Action has no redirect** — authActions.ts signOut() calls auth.api.signOut() but never calls redirect(). The client must handle navigation. This is not a security bug per se but a UX gap.

**signOut missing headers** — signOut() passes `headers: await headers()` which is correct for Better Auth to clear the session cookie server-side.

**signIn/signUp Server Actions call auth.api directly without headers** — Better Auth's nextCookies() plugin handles cookie setting automatically via the plugin mechanism, so this is by design.

**No rate limiting configured** — auth.ts has no `rateLimit` config. Better Auth has built-in rate limiting that must be explicitly enabled. Auth endpoints are currently unprotected against brute force.

**signIn leaks Better Auth error messages** — `error.message` from isAPIError is returned directly to the client. Better Auth error messages can include account existence information.

**Auth layout redirects to "/" not "/dashboard"** — app/(auth)/layout.tsx redirects authenticated users to "/" (landing page) rather than "/dashboard". Landing page then needs its own session check to forward to dashboard — creates an unnecessary redirect chain but not a security issue.

**Defense-in-depth is layered correctly** — proxy.ts runs before layout, layout runs getSession() as secondary check. Both must fail for unauthorized access.

## Versions confirmed
- next: 16.2.6
- better-auth: ^1.6.11
- prisma: ^7.8.0
- zod: ^4.4.3

**Why:** Institutional knowledge for future audits of this codebase.
**How to apply:** Use these findings when auditing future phases (Server Actions for Accounts, Transactions, etc.) — the rate limiting and error message leakage patterns will likely recur.
