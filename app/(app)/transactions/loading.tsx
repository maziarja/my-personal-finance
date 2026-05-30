import { TransactionTableSkeleton } from "@/components/transactions/transaction-table-skeleton";

export default function TransactionsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-muted-foreground text-sm">
          Track your income and expenses
        </p>
      </div>
      <TransactionTableSkeleton />
    </div>
  );
}
