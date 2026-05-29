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

export function TransactionList() {
  const {
    data: transactions,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  if (
    isError ||
    (transactions && "error" in transactions) ||
    (categories && "error" in categories) ||
    (accounts && "error" in accounts)
  ) {
    return <TransactionsError onRetry={refetch} />;
  }
  if (!transactions || !accounts || !categories || transactions?.length === 0) {
    return <TransactionsEmpty accounts={accounts} categories={categories} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateTransactionDialog accounts={accounts} categories={categories} />
      </div>
      <TransactionFilters accounts={accounts} categories={categories} />
      <TransactionTable
        transactions={transactions}
        accounts={accounts}
        categories={categories}
      />
    </div>
  );
}
