"use client";

import {
  acceptTransaction,
  cancelTransaction,
  createTransaction,
  deleteTransaction,
  rejectTransaction,
} from "@/app/_actions/transactionActions";
import { transactionKeys } from "@/lib/query-keys/transactions";
import {
  AccountOption,
  CategoryOption,
} from "@/components/transactions/transaction-form";
import { Transaction } from "@/components/transactions/transaction-table";
import {
  AcceptTransactionFormType,
  TransactionFormType,
} from "@/lib/schemas/transactionSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TransactionStatus,
  TransactionType,
} from "@/app/generated/prisma/enums";

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
      await context.client.cancelQueries({ queryKey: transactionKeys.all() });
      // Snapshot prev transaction
      const previousTransactions = context.client.getQueryData<Transaction[]>(
        transactionKeys.list(),
      );
      // Set optimistic transaction
      const optimisticTransaction = {
        id: crypto.randomUUID(),
        ...data,
        financialAccount: account,
        category: category,
        ...(data.to && { status: TransactionStatus.PENDING }),
        ...(data.to && { type: TransactionType.EXPENSE }),
        amount: Number(data.amount),
      };
      context.client.setQueryData<Transaction[]>(
        transactionKeys.list(),
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
        transactionKeys.list(),
        onMutateResult?.previousTransactions,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({
        queryKey: transactionKeys.all(),
      });
    },
  });

  //// Delete transaction
  const { mutate: remove } = useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onMutate: async (newId, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: transactionKeys.all() });
      // Snapshot previous transactions
      const previousTransactions = context.client.getQueryData<Transaction[]>(
        transactionKeys.list(),
      );
      // Set optimistic transaction
      context.client.setQueryData<Transaction[]>(
        transactionKeys.list(),
        (old = []) => old.filter((o) => o.id !== newId),
      );
      return { previousTransactions };
    },

    // Role back on error
    onError: (err, _transactionId, onMutateResult, context) => {
      context.client.setQueryData(
        transactionKeys.list(),
        onMutateResult?.previousTransactions,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _transactionId, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({
        queryKey: transactionKeys.all(),
      });
    },
  });

  /// Accept transaction

  const { mutate: accept } = useMutation({
    mutationFn: ({
      dataWithId,
    }: {
      dataWithId: AcceptTransactionFormType & { transactionId: string };
      category: CategoryOption;
      financialAccount: AccountOption;
    }) => acceptTransaction(dataWithId),
    onMutate: async ({ dataWithId, category, financialAccount }, context) => {
      // Cancel the querying
      await context.client.cancelQueries({
        queryKey: transactionKeys.all(),
      });
      // Snapshot prev value
      const previousTransaction = context.client.getQueryData<Transaction[]>(
        transactionKeys.list(),
      );
      // Optimistic transaction update
      const optimisticTransaction = {
        dataWithId,
        category,
        financialAccount,
        status: TransactionStatus.COMPLETE,
      };

      context.client.setQueryData<Transaction[]>(
        transactionKeys.list(),
        (old = []) =>
          old.map((o) =>
            o.id === optimisticTransaction.dataWithId.transactionId
              ? { ...o, ...optimisticTransaction }
              : o,
          ),
      );
      return { previousTransaction };
    },
    //  Role back on error
    onError: (err, _updatedTransaction, onMutateResult, context) => {
      toast.error(err.message);

      context.client.setQueryData(
        transactionKeys.list(),
        onMutateResult?.previousTransaction,
      );
    },

    onSettled: (data, _error, _variables, _onMutateResult, context) => {
      if (data && "error" in data) toast.error(data.error);

      return context.client.invalidateQueries({
        queryKey: transactionKeys.all(),
      });
    },
  });

  //  Cancel a transaction
  const { mutate: cancel } = useMutation({
    mutationFn: (transactionId: string) => cancelTransaction(transactionId),

    onMutate: async (transactionId, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: transactionKeys.all() });
      // Snapshot of a prev transactions list
      const previousTransactions = context.client.getQueryData<Transaction[]>(
        transactionKeys.list(),
      );

      // Set optimistic transaction
      context.client.setQueryData<Transaction[]>(
        transactionKeys.list(),
        (old = []) =>
          old.map((o) =>
            o.id === transactionId
              ? { ...o, status: TransactionStatus.CANCELED }
              : o,
          ),
      );

      return { previousTransactions };
    },

    //  Role back on error
    onError: (err, _updatedTransaction, onMutateResult, context) => {
      toast.error(err.message);

      context.client.setQueryData(
        transactionKeys.list(),
        onMutateResult?.previousTransactions,
      );
    },

    onSettled: (data, _error, _variables, _onMutateResult, context) => {
      if (data && "error" in data) toast.error(data.error);

      return context.client.invalidateQueries({
        queryKey: transactionKeys.all(),
      });
    },
  });
  // Reject a transaction
  const { mutate: reject } = useMutation({
    mutationFn: (transactionId: string) => rejectTransaction(transactionId),

    onMutate: async (transactionId, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: transactionKeys.all() });
      // Snapshot of a prev transactions list
      const previousTransactions = context.client.getQueryData<Transaction[]>(
        transactionKeys.list(),
      );

      // Set optimistic transaction
      context.client.setQueryData<Transaction[]>(
        transactionKeys.list(),
        (old = []) =>
          old.map((o) =>
            o.id === transactionId
              ? { ...o, status: TransactionStatus.REJECTED }
              : o,
          ),
      );

      return { previousTransactions };
    },

    //  Role back on error
    onError: (err, _updatedTransaction, onMutateResult, context) => {
      toast.error(err.message);

      context.client.setQueryData(
        transactionKeys.list(),
        onMutateResult?.previousTransactions,
      );
    },

    onSettled: (data, _error, _variables, _onMutateResult, context) => {
      if (data && "error" in data) toast.error(data.error);

      return context.client.invalidateQueries({
        queryKey: transactionKeys.all(),
      });
    },
  });

  return { create, remove, accept, cancel, reject };
}
