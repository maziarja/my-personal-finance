import { TransactionList } from "@/components/transactions/transaction-list";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/helpers/get-query-client";
import { getTransactions } from "@/app/_actions/transactionActions";
import { transactionKeys } from "@/lib/query-keys/transactions";
import { getAccounts } from "@/app/_actions/accountActions";
import { accountKey } from "@/lib/query-keys/accounts";
import { categoryKey } from "@/lib/query-keys/categories";
import { getCategories } from "@/app/_actions/categoryActions";

export default async function TransactionsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: transactionKeys.list(),
      queryFn: () => getTransactions({}),
    }),
    queryClient.prefetchQuery({ queryKey: accountKey.list(), queryFn: getAccounts }),
    queryClient.prefetchQuery({
      queryKey: categoryKey.list(),
      queryFn: getCategories,
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-l-2 border-brand/45 pl-3">
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
