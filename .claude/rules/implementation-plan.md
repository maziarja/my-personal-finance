# Implementation Plan

Tasks are tagged by owner:
- `[UI]` — Claude builds this (components, layout, styling)
- `[Logic]` — User implements this (Server Actions, Zustand, TanStack Query, Prisma)
- `[Both]` — done together or sequentially

---

## Phase 1 — Setup & Configuration

Get the full stack installed and wired together before writing any features.

- [ ] `[Logic]` Install all dependencies: Prisma, `@prisma/client`, `@neondatabase/serverless`, `better-auth`, `zustand`, `@tanstack/react-query`, `zod`, `react-hook-form`, `@hookform/resolvers`, `recharts`
- [ ] `[UI]` Install and initialize Shadcn UI (`npx shadcn init`)
- [ ] `[Logic]` Create `.env.local` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- [ ] `[Logic]` Initialize Prisma (`npx prisma init`) and configure Neon connection
- [ ] `[Logic]` Configure TanStack Query provider in `app/layout.tsx`
- [ ] `[Logic]` Configure Better Auth (`lib/auth.ts`) — email + password, attach Prisma adapter
- [ ] `[Logic]` Protect routes by checking auth session inside each `page.tsx` (no middleware — redirect unauthenticated users directly from the page)

---

## Phase 2 — Database Schema

Define all models before building any features.

- [ ] `[Logic]` Write Prisma model: `User` (managed by Better Auth)
- [ ] `[Logic]` Write Prisma model: `Account` (name, type, balance, userId)
- [ ] `[Logic]` Write Prisma model: `Category` (name, color, icon, userId)
- [ ] `[Logic]` Write Prisma model: `Transaction` (amount, type, date, notes, accountId, categoryId, userId)
- [ ] `[Logic]` Write Prisma model: `Budget` (categoryId, monthlyLimit, month, userId)
- [ ] `[Logic]` Write Prisma model: `Goal` (name, targetAmount, currentAmount, deadline, userId)
- [ ] `[Logic]` Run `npx prisma migrate dev` and push schema to Neon

---

## Phase 3 — Auth Pages

- [ ] `[UI]` Build sign-in page (`app/(auth)/sign-in/page.tsx`) — form with email + password fields
- [ ] `[UI]` Build sign-up page (`app/(auth)/sign-up/page.tsx`) — form with name, email, password
- [ ] `[UI]` Build shared auth layout (`app/(auth)/layout.tsx`) — centered card layout
- [ ] `[Logic]` Wire sign-in form to Better Auth `signIn.email()`
- [ ] `[Logic]` Wire sign-up form to Better Auth `signUp.email()`
- [ ] `[Logic]` Handle redirect after login → dashboard

---

## Phase 4 — App Shell & Navigation

- [ ] `[UI]` Build sidebar with nav links: Dashboard, Transactions, Accounts, Budgets, Goals, Categories
- [ ] `[UI]` Build top header bar (page title, user avatar/menu, sign out button)
- [ ] `[UI]` Build authenticated app layout (`app/(app)/layout.tsx`) wrapping sidebar + header
- [ ] `[UI]` Build route stubs (empty pages) for all sections so navigation works end-to-end
- [ ] `[Logic]` Wire sign out button to Better Auth `signOut()`

---

## Phase 5 — Accounts

- [ ] `[UI]` Build accounts list page — grid of account cards (name, type, balance)
- [ ] `[UI]` Build account card component
- [ ] `[UI]` Build create account dialog — form: name, type (select), opening balance
- [ ] `[UI]` Build edit account dialog (same form, pre-filled)
- [ ] `[UI]` Add delete confirmation dialog
- [ ] `[Logic]` Server Action: `createAccount`, `updateAccount`, `deleteAccount`
- [ ] `[Logic]` Server Component: fetch accounts list and pass to client
- [ ] `[Logic]` TanStack Query: `useAccounts`, wire create/update/delete to `useMutation`

---

## Phase 6 — Categories

- [ ] `[UI]` Build categories page — table or tag-style list
- [ ] `[UI]` Build create/edit category dialog — name, color picker, icon picker
- [ ] `[UI]` Add delete confirmation
- [ ] `[Logic]` Server Action: `createCategory`, `updateCategory`, `deleteCategory`
- [ ] `[Logic]` Server Component: fetch categories and pass to client
- [ ] `[Logic]` TanStack Query: `useCategories`, wire mutations

---

## Phase 7 — Transactions

- [ ] `[UI]` Build transactions list page — sortable table with columns: date, description, category, account, amount
- [ ] `[UI]` Build filter bar — filter by account, category, type (income/expense), date range
- [ ] `[UI]` Build add transaction dialog — amount, type, category (select), account (select), date, notes
- [ ] `[UI]` Build edit transaction dialog (same form, pre-filled)
- [ ] `[UI]` Add delete confirmation
- [ ] `[Logic]` Server Action: `createTransaction`, `updateTransaction`, `deleteTransaction`
- [ ] `[Logic]` Server Component: fetch transactions (with filters) and pass to client
- [ ] `[Logic]` TanStack Query: `useTransactions`, wire mutations
- [ ] `[Logic]` Zustand: store active filters (account, category, type, date range)

---

## Phase 8 — Budgets

- [ ] `[UI]` Build budgets page — list of budget cards, one per category
- [ ] `[UI]` Build budget card — category name, spent vs limit, Recharts progress bar
- [ ] `[UI]` Build create/edit budget dialog — category (select), monthly limit, month picker
- [ ] `[UI]` Add delete confirmation
- [ ] `[Logic]` Server Action: `createBudget`, `updateBudget`, `deleteBudget`
- [ ] `[Logic]` Server Component: fetch budgets with computed `spentAmount` for current month
- [ ] `[Logic]` TanStack Query: `useBudgets`, wire mutations

---

## Phase 9 — Goals

- [ ] `[UI]` Build goals page — grid of goal cards
- [ ] `[UI]` Build goal card — name, progress bar (Recharts), current vs target, deadline badge
- [ ] `[UI]` Build create/edit goal dialog — name, target amount, deadline (optional)
- [ ] `[UI]` Build add contribution dialog — amount input
- [ ] `[UI]` Add delete confirmation
- [ ] `[Logic]` Server Action: `createGoal`, `updateGoal`, `deleteGoal`, `addContribution`
- [ ] `[Logic]` Server Component: fetch goals and pass to client
- [ ] `[Logic]` TanStack Query: `useGoals`, wire mutations

---

## Phase 10 — Dashboard

- [ ] `[UI]` Build dashboard layout — responsive grid of sections
- [ ] `[UI]` Build account balances section — summary cards per account
- [ ] `[UI]` Build recent transactions section — last 10, same row style as transactions page
- [ ] `[UI]` Build budget progress section — compact budget bars (reuse budget card)
- [ ] `[UI]` Build spending overview chart — Recharts bar or pie chart (this month vs last month by category)
- [ ] `[Logic]` Server Component: fetch all dashboard data in parallel (accounts, recent transactions, budgets, spending summary)
- [ ] `[Logic]` Pass data into client chart components via props

---

## Phase 11 — Polish & Deploy

- [ ] `[UI]` Add loading skeletons for all list/table pages
- [ ] `[UI]` Add empty states for all sections (no accounts yet, no transactions yet, etc.)
- [ ] `[UI]` Audit mobile responsiveness across all pages
- [ ] `[Logic]` Add Zod validation to all Server Actions
- [ ] `[Logic]` Add error handling — surface Server Action errors in forms via React Hook Form
- [ ] `[Logic]` Set up Vercel project, add environment variables
- [ ] `[Logic]` Run `prisma migrate deploy` against production Neon database
- [ ] `[Logic]` Deploy and smoke-test the full auth + transaction flow
