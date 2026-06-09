---
name: prisma-notes
description: Missing indexes and Prisma query patterns flagged in review
metadata:
  type: project
---

## Indexes present (from schema.prisma)
- `Session.userId` — indexed
- `Account.userId` — indexed
- `FinancialAccount.ownerId` — indexed
- `Category.userId` — indexed
- `Transaction.userId` — indexed
- `Budget.userId` — indexed
- `Goal.userId` — indexed
- `Verification.identifier` — indexed

## Missing indexes flagged
- `Transaction.date` — queried with date range filters (`gte`/`lte`) in `getTransactions`, `getBudgets`, and `getSpendingData`. Without an index on `date`, these range scans hit the full user's transaction set. Add `@@index([userId, date])` compound index. [Logic]
- `Transaction.transferId` — looked up in `acceptTransaction`, `cancelTransaction`, `rejectTransaction`. Without an index, this is a full table scan on the transaction set. Add `@@index([transferId])`. [Logic]
- `Transaction.categoryId` — used in budget spending aggregation. A compound `@@index([userId, categoryId, date])` would cover the spending filter query in `getBudgets`. [Logic]

## Select usage
- `getTransactions`: uses `include` with nested `select` — good (only fetches name/type/id from related models).
- `deleteTransaction`: uses `select` to fetch only needed fields before deleting — good.
- `acceptTransaction`: uses `select` on both findUnique calls — good.
- `getAccounts`: no `select` — fetches all FinancialAccount columns including balance. Acceptable since all columns are needed.
- `getBudgets`: uses `include: { category: true }` which fetches the full Category row. Should use `select` to fetch only `id`, `name`, `color`. [Logic]

## N+1 patterns
None found. All related data is fetched via `include`/`select` at the query level, not in a loop.

## Sequential awaits inside $transaction
`acceptTransaction` has four sequential `await` calls inside `prisma.$transaction(async tx => ...)`. The first two (findUnique receiver, findFirst sender) cannot be parallelized because sender lookup depends on `receiverTransaction.transferId`. The latter two update calls are also dependent. Acceptable pattern.
