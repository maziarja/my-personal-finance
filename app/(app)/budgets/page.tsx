import { getBudgets } from "@/app/_actions/budgetActions";
import { getCategories } from "@/app/_actions/categoryActions";
import { budgetKey } from "@/lib/query-keys/budgets";
import { categoryKey } from "@/lib/query-keys/categories";
import { BudgetList } from "@/components/budgets/budget-list";
import { getQueryClient } from "@/lib/helpers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { transactionKeys } from "@/lib/query-keys/transactions";
import { getTransactions } from "@/app/_actions/transactionActions";

export default async function BudgetsPage() {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: budgetKey.list(),
      queryFn: getBudgets,
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKey.list(),
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: transactionKeys.list(),
      queryFn: () => getTransactions({}),
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-brand/45 border-l-2 pl-3">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <p className="text-muted-foreground text-sm">
          Set monthly spending limits per category
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BudgetList />
      </HydrationBoundary>
    </div>
  );
}
