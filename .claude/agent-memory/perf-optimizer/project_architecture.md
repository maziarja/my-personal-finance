---
name: project-architecture
description: Stack overview, data-fetching pattern, and known architectural decisions as of first full review (June 2026)
metadata:
  type: project
---

Next.js App Router project. All pages are Server Components; data is prefetched via `getQueryClient()` + `prefetchQuery` + `HydrationBoundary`, then consumed on the client by `useQuery`. All mutations go through Server Actions paired with TanStack Query `useMutation`.

Global `staleTime` is set to 60 000 ms (1 minute) in `lib/helpers/get-query-client.ts`. No per-query overrides exist.

**Why:** The user is learning Zustand and TanStack Query; the architecture is intentionally layered for educational clarity.
**How to apply:** Flag caching issues against this 60 s baseline. Do not suggest rewrites that blur the Server Component / Client Component split.

Prisma schema lives at `prisma/schema.prisma`; generated client at `app/generated/prisma/`.
