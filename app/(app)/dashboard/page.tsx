import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/helpers/get-query-client";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { accountKey } from "@/lib/query-keys/accounts";
import { getAccounts } from "@/app/_actions/accountActions";
import { categoryKey } from "@/lib/query-keys/categories";
import { getCategories, getSpendingData } from "@/app/_actions/categoryActions";
import { transactionKeys } from "@/lib/query-keys/transactions";
import { getTransactions } from "@/app/_actions/transactionActions";
import { budgetKey } from "@/lib/query-keys/budgets";
import { getBudgets } from "@/app/_actions/budgetActions";
import { RECENT_TRANSACTION_NUM } from "@/lib/const";

export default async function DashboardPageRoute() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: accountKey.list(),
      queryFn: getAccounts,
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKey.list(),
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: transactionKeys.recent(RECENT_TRANSACTION_NUM),
      queryFn: () => getTransactions({}, RECENT_TRANSACTION_NUM),
    }),
    queryClient.prefetchQuery({
      queryKey: budgetKey.list(),
      queryFn: getBudgets,
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKey.spendingData(),
      queryFn: getSpendingData,
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-brand/45 border-l-2 pl-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Your financial snapshot at a glance
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardPage />
      </HydrationBoundary>
    </div>
  );
}
