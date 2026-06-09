---
name: tanstack-query-config
description: Global and per-query cache configuration decisions in this project
metadata:
  type: project
---

## Global configuration (`lib/helpers/get-query-client.ts`)
- `staleTime`: 60 000 ms (1 minute)
- `gcTime`: not set (defaults to 5 minutes in TanStack Query v5)
- No `retry` override (defaults to 3 retries)

## Per-query overrides
None. All queries rely on the global 60 s staleTime.

## Cache key structure
- accounts: `["accounts"] / ["accounts", "list"]`
- categories: `["categories"] / ["categories", "list"] / ["categories", "list", "spendingData"]`
- transactions: `["transactions"] / ["transactions", "list", filtersObject] / ["transactions", "recent", limit]`
- budgets: `["budgets"] / ["budgets", "list"]`
- goals: `["goals"] / ["goals", "list"]` — NOTE: goals keys lack `as const`, widened to `string[]`

## Observations
- Transaction list key includes a filter object. TanStack Query does deep-equal the key, so this is correct in theory, but the filter object is recreated on every render in `TransactionList`, which can bypass the cache hit detection until the query re-runs. Recommend memoizing the active-filters object.
- `transactionKeys.all()` is used for broad invalidation (invalidates both the filtered list and the recent list). This is intentional and correct.
- `spendingData` key is nested under `categoryKey` (`["categories", "list", "spendingData"]`), which means invalidating `categoryKey.all()` (`["categories"]`) will also invalidate spending data — correct behaviour.
