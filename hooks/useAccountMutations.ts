"use client";

import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/app/_actions/accountActions";
import { Account } from "@/components/accounts/account-card";
import {
  AccountFormType,
  UpdatedAccountFormType,
} from "@/lib/schemas/accountSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAccountMutations() {
  //// Create account
  const { mutate: create } = useMutation({
    mutationFn: (data: AccountFormType) => createAccount(data),
    onMutate: async (newAccount, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: ["accounts"] });
      // Snapshot prev account
      const previousAccounts = context.client.getQueryData<Account[]>([
        "accounts",
      ]);
      // Set optimistic account
      const optimisticAccount: Account = {
        id: crypto.randomUUID(),
        ...newAccount,
        balance: Number(newAccount.balance),
      };
      context.client.setQueryData<Account[]>(["accounts"], (old = []) =>
        [...old, optimisticAccount].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return { previousAccounts };
    },

    // Role back on error
    onError: (err, newAccount, onMutateResult, context) => {
      context.client.setQueryData(
        ["accounts"],
        onMutateResult?.previousAccounts,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, error, variable, onMutateResult, context) => {
      return context.client.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  //// Update account
  const { mutate: update } = useMutation({
    mutationFn: (updatedAccount: UpdatedAccountFormType) =>
      updateAccount(updatedAccount),

    onMutate: async (newAccount, context) => {
      // Cancel Querying
      await context.client.cancelQueries({ queryKey: ["accounts"] });
      // Snapshot previous accounts
      const previousAccounts = context.client.getQueryData<Account[]>([
        "accounts",
      ]);
      // Set optimistic account
      context.client.setQueryData<Account[]>(["accounts"], (old = []) =>
        old
          .map((o) => {
            return o.id === newAccount.id
              ? {
                  ...o,
                  ...newAccount,
                  balance: Number(newAccount.balance),
                }
              : o;
          })
          .sort((a, b) => a.name.localeCompare(b.name)),
      );

      return { previousAccounts };
    },

    // Role back on error
    onError: (err, updatedAccount, onMutateResult, context) => {
      context.client.setQueryData(
        ["accounts"],
        onMutateResult?.previousAccounts,
      );
      toast.error(err.message);
    },

    onSettled: (data, error, updatedAccount, onMutateResult, context) => {
      return context.client.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  //// Delete account
  const { mutate: remove } = useMutation({
    mutationFn: (accountId: string) => deleteAccount(accountId),
    onMutate: async (newId, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: ["accounts"] });
      // Snapshot previous accounts
      const previousAccounts = context.client.getQueryData<Account[]>([
        "accounts",
      ]);
      // Set optimistic accounts
      context.client.setQueryData<Account[]>(["accounts"], (old = []) =>
        old.filter((o) => o.id !== newId),
      );
      return { previousAccounts };
    },

    // Role back on error
    onError: (err, accountId, onMutateResult, context) => {
      context.client.setQueryData(
        ["accounts"],
        onMutateResult?.previousAccounts,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, error, accountId, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return { create, update, remove };
}
