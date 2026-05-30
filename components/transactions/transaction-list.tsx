"use client";

import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionsEmpty } from "@/components/transactions/transactions-empty";
import { TransactionsError } from "@/components/transactions/transactions-error";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/app/_actions/transactionActions";
import { getCategories } from "@/app/_actions/categoryActions";
import { getAccounts } from "@/app/_actions/accountActions";
import { useTransactionFiltersStore } from "@/hooks/useTransactionFiltersStore";
import { TransactionTableSkeleton } from "@/components/transactions/transaction-table-skeleton";

export function TransactionList() {
  const accountId = useTransactionFiltersStore((state) => state.accountId);
  const categoryId = useTransactionFiltersStore((state) => state.categoryId);
  const type = useTransactionFiltersStore((state) => state.type);
  const from = useTransactionFiltersStore((state) => state.from);
  const to = useTransactionFiltersStore((state) => state.to);

  const transactionFilters = {
    accountId,
    categoryId,
    type,
    from,
    to,
  };

  const activeFilters = Object.fromEntries(
    Object.entries(transactionFilters).filter(
      ([_, v]) => v !== null && v !== "",
    ),
  );
  const hasActiveFilters = Object.entries(activeFilters).length > 0;

  const {
    data: transactions,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transactions", activeFilters],
    queryFn: () => getTransactions(activeFilters),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  if (isPending) return <TransactionTableSkeleton />;

  if (
    isError ||
    (transactions && "error" in transactions) ||
    (categories && "error" in categories) ||
    (accounts && "error" in accounts)
  ) {
    return <TransactionsError onRetry={refetch} />;
  }

  if (
    !transactions ||
    !accounts ||
    !categories ||
    (transactions.length === 0 && !hasActiveFilters)
  ) {
    return <TransactionsEmpty accounts={accounts} categories={categories} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateTransactionDialog accounts={accounts} categories={categories} />
      </div>
      <TransactionFilters accounts={accounts} categories={categories} />
      {transactions.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No transactions match the current filters.
        </p>
      ) : (
        <TransactionTable
          transactions={transactions}
          accounts={accounts}
          categories={categories}
        />
      )}
    </div>
  );
}
