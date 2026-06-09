---
name: recurring-antipatterns
description: Performance anti-patterns found across the codebase that may recur in future work
metadata:
  type: project
---

## Identified in first full review (June 2026)

1. **Unstable `transactionFilters` object in `TransactionList`** — A new object literal is created on every render (`lib/query-keys/transactions.ts` list key includes a filter object). The object is built inline and passed directly to `queryKey`, breaking TanStack Query's cache hit detection when filters haven't actually changed. Fix: `useMemo` on the filters object.

2. **`transactionKeys.list()` called with no args in `BudgetList`** — `budget-list.tsx` fetches all transactions with `transactionKeys.list()` (no filters), but `transactions/page.tsx` also prefetches with `transactionKeys.list()` (no filters). These share a cache key — good. However, the budgets page prefetches all transactions at page load just for the `spentAmount` computation that could already come from `getBudgets()`.

3. **`TooltipProvider` instantiated per-row in `transaction-table.tsx`** — Each `TransactionRow` with notes or P2P fields creates its own `<TooltipProvider>`. A global `TooltipProvider` already exists in `lib/providers.tsx`. These are redundant providers; remove them from row-level JSX. [UI]

4. **Inline IIFE in JSX (`transaction-form.tsx` line 250)** — An immediately-invoked function expression runs inside a `render` prop to find an account. Runs on every render. Replace with a `useMemo` or variable. [UI]

5. **`sortedTransactions` sort in `TransactionTable` is not memoized** — Runs `[...transactions].sort(...)` on every render of the table, including renders caused by unrelated parent state changes (sortColumn / sortDirection changes are fine, but parent re-renders are not). Should be `useMemo`. [UI]

6. **`formatCurrency` / `formatMonth` helpers defined as module-level arrow functions** — These call `new Intl.NumberFormat()` on every call with no memoization. For large lists, cache the formatter instance at module level.

7. **`goalKey.all()` and `goalKey.list()` return plain arrays (no `as const`)** — Unlike other query key files, `lib/query-keys/goals.ts` does not use `as const`, making keys widened to `string[]` rather than a literal tuple. This can cause subtle cache miss issues. [Logic]

8. **Sequential `await` inside `prisma.$transaction` in `acceptTransaction`** — Four sequential DB operations run inside the interactive transaction. They are necessarily sequential (each depends on the previous result) so this is acceptable, but the two `findUnique` calls at the top could be parallelized if a `transferId` lookup were restructured. Low priority. [Logic]

9. **`getSpendingData` in `categoryActions.ts` issues two separate `findMany` queries to Prisma** — Both run in parallel via `Promise.all`, which is correct. No N+1 here.

10. **`getBudgets` fetches ALL budgets then filters transactions in JS** — The action fetches budgets across all months, then fetches ALL matching transactions, then groups in JS. As the dataset grows this is memory-intensive. A `groupBy` aggregate or a per-budget sub-query would be more efficient. [Logic]

11. **`DashboardPage` (`components/dashboard/dashboard-page.tsx`) has no `staleTime` override** — Dashboard data (accounts, spending) changes infrequently; the 60 s global applies, which is acceptable but could be higher for spending chart data.

12. **`BudgetProgressSection` is a Server Component** — It receives props and renders JSX with no hooks or browser APIs. The `"use client"` directive is absent (correct). But it imports from `"../budgets/budgets-error"` which may be a client component. Worth verifying. [UI]
