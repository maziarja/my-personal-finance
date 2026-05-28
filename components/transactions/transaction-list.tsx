"use client";

import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionsEmpty } from "@/components/transactions/transactions-empty";
import { TransactionsError } from "@/components/transactions/transactions-error";
import type { Transaction } from "@/components/transactions/transaction-table";
import type { AccountOption, CategoryOption } from "@/components/transactions/transaction-form";

export function TransactionList() {
  const transactions: Transaction[] = [];
  const accounts: AccountOption[] = [];
  const categories: CategoryOption[] = [];
  const isError = false;
  const refetch = () => {};

  if (isError) {
    return <TransactionsError onRetry={refetch} />;
  }

  if (transactions.length === 0) {
    return <TransactionsEmpty />;
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
