import { TransactionList } from "@/components/transactions/transaction-list";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/helpers/get-query-client";

export default async function TransactionsPage() {
  const queryClient = getQueryClient();

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-muted-foreground text-sm">
          Track your income and expenses
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionList />
      </HydrationBoundary>
    </div>
  );
}
