# Tech Stack

## Core
- **Framework:** Next.js (TypeScript, App Router)
- **Styling:** Tailwind CSS + Shadcn/ui
- **Database:** Neon Postgres via Prisma ORM
- **Auth:** Better Auth — email + password only

## State & Data Fetching
- **Zustand** — client-side UI state only (modals, filters, local interactions)
- **TanStack Query** — client-side caching and mutations
- **Server Components** — fetch initial data server-side; hydrate TanStack Query cache for client

## Mutations
- **Always use Server Actions** — no API routes
- Pair Server Actions with `useMutation` from TanStack Query for loading/error state on the client

## Forms & Validation
- **React Hook Form** — form state management
- **Zod** — schema validation (shared between Prisma, forms, and Server Action inputs)

## Charts
- **Recharts** — spending breakdowns, trends, budget progress

## Deployment
- **Vercel** — primary deployment target
