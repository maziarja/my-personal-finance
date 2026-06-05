"use client";

import { useQuery } from "@tanstack/react-query";
import { BudgetCard } from "@/components/budgets/budget-card";
import { BudgetsEmpty } from "@/components/budgets/budgets-empty";
import { BudgetsError } from "@/components/budgets/budgets-error";
import { BudgetListSkeleton } from "@/components/budgets/budget-list-skeleton";
import { CreateBudgetDialog } from "@/components/budgets/create-budget-dialog";
import { budgetKey } from "@/lib/query-keys/budgets";
import { categoryKey } from "@/lib/query-keys/categories";
import { getBudgets } from "@/app/_actions/budgetActions";
import { getCategories } from "@/app/_actions/categoryActions";
import { getCardSpan } from "@/lib/helpers/get-card-span";
import { transactionKeys } from "@/lib/query-keys/transactions";
import { getTransactions } from "@/app/_actions/transactionActions";

export function BudgetList() {
  const {
    data: budgets,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: budgetKey.list(),
    queryFn: getBudgets,
  });

  const { data: categories = [] } = useQuery({
    queryKey: categoryKey.list(),
    queryFn: getCategories,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: transactionKeys.list(),
    queryFn: () => getTransactions({}),
  });

  const categoryList = Array.isArray(categories) ? categories : [];
  const transactionList = Array.isArray(transactions) ? transactions : [];

  if (isPending) return <BudgetListSkeleton />;

  if (isError || (budgets && "error" in budgets)) {
    return <BudgetsError onRetry={refetch} />;
  }

  if (budgets?.length === 0) {
    return <BudgetsEmpty categories={categoryList} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateBudgetDialog
          categories={categoryList}
          transactions={transactionList}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {budgets?.map((budget, index) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            categories={categoryList}
            className={getCardSpan(index, budgets.length)}
          />
        ))}
      </div>
    </div>
  );
}
