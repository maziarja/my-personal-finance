---
name: architecture-decisions
description: Key architectural decisions and conventions that affect how this codebase should be reviewed
metadata:
  type: project
---

## Architecture Decisions

**Why:** These are project-specific choices that look like violations but are intentional.
**How to apply:** Do not flag these as errors in future reviews.

### TanStack Query v5 `context.client` Pattern
- All mutation hooks use `context.client.cancelQueries()`, `context.client.setQueryData()`, etc.
- This is valid TQ v5 API: `onMutate(variables, context: MutationFunctionContext)` where `MutationFunctionContext = { client: QueryClient, meta, mutationKey }`.
- Do NOT flag `context.client` as a bug — it is the correct TQ v5 pattern.

### `app/api/auth/[...all]/route.ts` API Route is Intentional
- This is the Better Auth handler, required by the library. It is NOT a violation of "no API routes".
- The rule "no API routes" applies to custom mutation/query endpoints. Better Auth's catch-all is infrastructure, not business logic.

### `proxy.ts` Instead of `middleware.ts`
- The project correctly uses `proxy.ts` for route protection (Next.js 16 convention).
- `middleware.ts` does NOT exist in this project — this is correct.

### `transactionKeys.list()` Default = `["transactions", {}]`
- `transactionKeys.list()` and `transactionKeys.list({})` produce the same key.
- The page prefetch uses `transactionKeys.list()` and the client starts with `transactionKeys.list({})` — these match due to TQ deep key comparison.

### Prisma `FinancialAccount` naming
- The app model is named `FinancialAccount` (not `Account`) to avoid collision with Better Auth's `Account` model. This is intentional and correct.

### Better Auth `nextCookies()` plugin
- `lib/auth.ts` uses `nextCookies()` plugin from `better-auth/next-js`. This is how Better Auth handles cookie-based sessions in Next.js App Router Server Actions. Not a bug.

### Optimistic updates use `transactionKeys.list()` (no filter)
- This is a known architectural limitation. When filters are active, optimistic updates target the unfiltered cache key. The `onSettled` invalidation corrects this. Documented in patterns audit as a medium-priority issue.
