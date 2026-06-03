---
name: patterns-audit-20260602
description: Recurring errors and systemic patterns found in Phase 7 audits (June 2026). Updated 2026-06-03 with fix status after second review pass.
metadata:
  type: project
---

## Recurring Patterns Found (June 2026 Audit)

**Why:** Recorded so future incremental reviews can spot regressions faster.
**How to apply:** When reviewing new or changed files, check for these known patterns first.

### 1. Missing `"use client"` on components with event handler props
- `components/transactions/transactions-error.tsx` — FIXED: now has `"use client"` directive
- `components/accounts/accounts-error.tsx` — status unknown (not reviewed in this pass)
- `components/categories/categories-error.tsx` — status unknown (not reviewed in this pass)

### 2. `acceptTransaction` not wrapped in `useMutation`
- FIXED: `accept` mutation is now defined in `hooks/useTransactionMutations.ts` and used via `useTransactionMutations()` in the dialog.
- The stale commented-out direct call `// await acceptTransaction(...)` still exists at line 72 of `accept-transaction-dialog.tsx`.
- Stale comment `// const { accept } = useTransactionMutations();` still exists at line 55.

### 3. Missing `loading.tsx` and `error.tsx` for stub routes
- `/app/(app)/transactions/` — FIXED: both exist
- `/app/(app)/dashboard/` — status unknown (not reviewed in this pass)
- `/app/(app)/budgets/` — status unknown (not reviewed in this pass)
- `/app/(app)/goals/` — status unknown (not reviewed in this pass)

### 4. Sign-up form unsafe result access
- `components/auth/sign-up-form.tsx` line 33: `if (result.error)` — status unknown, not reviewed in this pass.

### 5. `transactionId` not included in Zod schema for `acceptTransaction`
- STILL EXISTS: `acceptTransactionSchema` in `lib/schemas/transactionSchema.ts` does not include `transactionId`.
- `transactionId` is passed as a separate field and used directly in the server action without Zod validation.

### 6. Optimistic update key mismatch (transactions)
- STILL EXISTS: Mutation hooks use `transactionKeys.list()` (no filter args) for get/set.
- Active query uses `transactionKeys.list(activeFilters)` with filter args.
- When filters are active, optimistic updates write to a different cache key.

### 7. `TransactionForm` silent submit failure
- STILL EXISTS: `components/transactions/transaction-form.tsx` lines 70–82 — silent no-op if account/category object not found in passed arrays.

### 8. `updateTransaction` double-charges balance
- RESOLVED: `updateTransaction` server action no longer exists. Edit feature has been removed.

### 9. `cancelTransaction` and `rejectTransaction` missing try/catch
- FIXED: Both actions now wrap the `prisma.$transaction()` call in try/catch. Error is caught and `{ error: "..." }` is returned.

### 10. `cancelTransaction` non-atomic flow — DB read outside transaction
- FIXED for cancel/reject: Both now do the DB read inside `prisma.$transaction(async (tx) => { ... })`.
- Still present in `acceptTransaction`: `receiverTransaction` and `senderTransaction` reads (lines 254–275) happen before the `prisma.$transaction([...])` array call. If a concurrent request modifies those records, the subsequent writes can operate on stale data. This is a user-owned logic file issue.

### 11. `acceptTransaction` sender balance update missing `ownerId` guard
- FIXED: Line 319–321 now includes `ownerId: senderTransaction.userId` in the `where` clause.

### 12. `accept` mutation optimistic update spreads wrong shape
- STILL EXISTS: `hooks/useTransactionMutations.ts` lines 139–154: The optimistic object is `{ dataWithId, category, financialAccount, status }`. When spread via `{ ...o, ...optimisticTransaction }`, `dataWithId` becomes a top-level key on the cached `Transaction` object, and `category`/`financialAccount` keys overwrite the existing shaped fields. The merged object shape does not match `Transaction`. This causes the optimistic row to render with broken field access.

### 13. `reject-transaction-dialog` misleading copy
- FIXED: `reject-transaction-dialog.tsx` line 68 now says "No balance changes will occur if you reject this transfer." (accurate).

### 14. `transactions-error.tsx` missing `"use client"`
- FIXED: The file now has `"use client"` at line 1.

### 15. `transactionKeys` filter shape — `type` field is loosely typed
- FIXED: `lib/query-keys/transactions.ts` now uses `type?: TransactionType` (enum type, not `string`).

---

## New Issues Found in 2026-06-03 Re-review

### 16. `transactions-empty.tsx` missing `"use client"` — imports Client Component
- `components/transactions/transactions-empty.tsx` has no `"use client"` directive.
- It imports `CreateTransactionDialog` (a Client Component). Server Components can import Client Components, but only if they do not pass event-handler callbacks into them. Here no callbacks are passed, so it works at runtime — but only marginally. If `accounts`/`categories` are undefined, the dialog will receive `undefined` props. Low severity but worth noting.

### 17. Page prefetch uses `transactionKeys.list()` — client query uses `transactionKeys.list(activeFilters)`
- `app/(app)/transactions/page.tsx` line 16: `queryKey: transactionKeys.list()` (empty filters).
- `components/transactions/transaction-list.tsx` line 46: `queryKey: transactionKeys.list(activeFilters)`.
- On page load, `activeFilters` is `{}` (empty object from Zustand initial state), so `transactionKeys.list({})` and `transactionKeys.list()` produce `["transactions", {}]` vs `["transactions", {}]` — these are structurally equal BUT `{}` reference equality is checked by TanStack Query via deep equality for serialization. Since both produce the same serialized shape, the HydrationBoundary DOES match and hydration works. This is not a bug, but it is fragile — if the initial Zustand state ever changes, the hydration will silently miss. Medium risk.

### 18. `createTransaction` balance guard uses `<` instead of `<=` (MINIMUM_TRANSACTION_AMOUNT)
- `app/_actions/transactionActions.ts` line 75: `if (Number(rest.amount) < MINIMUM_TRANSACTION_AMOUNT)`.
- `MINIMUM_TRANSACTION_AMOUNT = 1`. So an amount of exactly `1` is allowed (1 is not < 1). This is correct behavior — amounts equal to the minimum are valid.
- This was flagged previously as `<=` being wrong; the current code uses `<` which IS correct. RESOLVED.

### 19. Stale commented-out imports and calls in `accept-transaction-dialog.tsx`
- Line 55: `// const { accept } = useTransactionMutations();` (stale comment — the real import is on line 54)
- Line 72: `// await acceptTransaction({ transactionId: transaction.id, ...data });` (stale comment)
- The import `acceptTransactionSchema` at line 26 is used (for the resolver), so that is not dead.
- Low severity dead code.

### 20. `deleteTransaction` only works on COMPLETE status — but status is nullable in schema
- `app/_actions/transactionActions.ts` line 208: `status: TransactionStatus.COMPLETE` in the `where` clause of the delete.
- The Prisma schema has `status TransactionStatus?` (optional), so a transaction with `status: null` would fail to match and return a Prisma error (not caught gracefully — wait, it IS in a try/catch, so it returns `{ error: "Unable to delete the transaction" }`).
- However, regular (non-P2P) transactions are always created with `status: COMPLETE`, so this is only a theoretical gap. Non-issue in practice.
