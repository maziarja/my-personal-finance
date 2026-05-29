"use client";

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/app/_actions/transactionActions";
import {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import { Transaction } from "@/components/transactions/transaction-table";
import {
  TransactionFormType,
  UpdatedTransactionFormType,
} from "@/lib/schemas/transactionSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTransactionMutations() {
  //// Create transaction
  const { mutate: create } = useMutation({
    mutationFn: ({
      data,
    }: {
      data: TransactionFormType;
      account: AccountOption;
      category: CategoryOption;
    }) => createTransaction(data),
    onMutate: async ({ data, account, category }, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: ["transactions"] });
      // Snapshot prev transaction
      const previousTransactions = context.client.getQueryData<Transaction[]>([
        "transactions",
      ]);
      // Set optimistic transaction
      const optimisticTransaction = {
        id: crypto.randomUUID(),
        ...data,
        financialAccount: account,
        category: category,
        amount: Number(data.amount),
      };
      context.client.setQueryData<Transaction[]>(
        ["transactions"],
        (old = []) => {
          return [...old, optimisticTransaction];
        },
      );

      //   We do sort later on here
      return { previousTransactions };
    },

    // Role back on error
    onError: (err, _newTransaction, onMutateResult, context) => {
      context.client.setQueryData(
        ["transactions"],
        onMutateResult?.previousTransactions,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  // Update transaction
  const { mutate: update } = useMutation({
    mutationFn: ({
      updatedTransaction,
    }: {
      updatedTransaction: UpdatedTransactionFormType;
      account: AccountOption;
      category: CategoryOption;
    }) => updateTransaction(updatedTransaction),

    onMutate: async ({ updatedTransaction, account, category }, context) => {
      // Cancel Querying
      await context.client.cancelQueries({ queryKey: ["transactions"] });
      // Snapshot previous transaction
      const previousTransaction = context.client.getQueryData<Transaction[]>([
        "transactions",
      ]);
      // Set optimistic transaction
      context.client.setQueryData<Transaction[]>(
        ["transactions"],
        (old = []) =>
          old.map((o) => {
            return o.id === updatedTransaction.id
              ? {
                  ...o,
                  ...updatedTransaction,
                  financialAccount: account,
                  category,
                  amount: Number(updatedTransaction.amount),
                }
              : o;
          }),
        //   sort here later on
      );

      return { previousTransaction };
    },

    // Role back on error
    onError: (err, _updatedTransaction, onMutateResult, context) => {
      context.client.setQueryData(
        ["transactions"],
        onMutateResult?.previousTransaction,
      );
      toast.error(err.message);
    },

    onSettled: (
      data,
      _error,
      _updatedTransaction,
      _onMutateResult,
      context,
    ) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  //   //// Delete transaction
  const { mutate: remove } = useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onMutate: async (newId, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: ["transaction"] });
      // Snapshot previous transactions
      const previousTransactions = context.client.getQueryData<Transaction[]>([
        "transactions",
      ]);
      // Set optimistic transaction
      context.client.setQueryData<Transaction[]>(["transactions"], (old = []) =>
        old.filter((o) => o.id !== newId),
      );
      return { previousTransactions };
    },

    // Role back on error
    onError: (err, _transactionId, onMutateResult, context) => {
      context.client.setQueryData(
        ["transactions"],
        onMutateResult?.previousTransactions,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _transactionId, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return { create, update, remove };
}
