---
name: auth-conventions
description: How session retrieval and route protection work in this project — patterns to verify in future Server Actions
metadata:
  type: project
---

## Session retrieval pattern
`getSession()` in `lib/helpers/getSession.ts` calls `auth.api.getSession({ headers: await headers() })`. This is the canonical way to get the session in Server Components and Server Actions for this project.

## Route protection layers
1. `proxy.ts` (Next.js 16 proxy, runs before everything) — redirects to "/" if no session
2. `app/(app)/layout.tsx` (Server Component layout) — calls `getSession()`, redirects to "/" if no session
3. Individual Server Actions MUST also call `getSession()` and scope every Prisma query to `userId`

## nextCookies() plugin
`lib/auth.ts` uses `nextCookies()` as the last plugin. This allows Better Auth's signIn/signUp/signOut Server Actions to set/clear cookies without explicitly passing headers to `auth.api.signInEmail()` etc. This is correct and intentional — do not flag missing headers on signIn/signUp calls as a bug.

## Better Auth error handling
`isAPIError(error)` from `better-auth/api` is used to distinguish auth errors from unexpected errors. Auth errors return `error.message` directly. This is a mild information leakage risk (account existence oracle).

## No API routes (except Better Auth internal)
Only `/api/auth/[...all]/route.ts` exists as an API route. All application mutations use Server Actions. Never suggest adding new API routes.

**Why:** Required context for auditing future Server Actions that must call getSession() and filter by userId.
**How to apply:** When auditing any Server Action for Accounts, Transactions, Budgets, Goals, Categories — verify getSession() is called first, userId is used in every Prisma query, and errors are sanitized.
