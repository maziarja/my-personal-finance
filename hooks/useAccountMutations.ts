"use client";

import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/app/_actions/accountActions";
import { Account } from "@/lib/types/account";
import {
  AccountFormType,
  UpdatedAccountFormType,
} from "@/lib/schemas/accountSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountKey } from "@/lib/query-keys/accounts";

export function useAccountMutations() {
  //// Create account
  const { mutate: create } = useMutation({
    mutationFn: (data: AccountFormType) => createAccount(data),
    onMutate: async (newAccount, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: accountKey.all() });
      // Snapshot prev account
      const previousAccounts = context.client.getQueryData<Account[]>(accountKey.list());
      // Set optimistic account
      const optimisticAccount: Account = {
        id: crypto.randomUUID(),
        ...newAccount,
        balance: Number(newAccount.balance),
      };
      context.client.setQueryData<Account[]>(accountKey.list(), (old = []) =>
        [...old, optimisticAccount].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      return { previousAccounts };
    },

    // Role back on error
    onError: (err, _newAccount, onMutateResult, context) => {
      context.client.setQueryData(
        accountKey.list(),
        onMutateResult?.previousAccounts,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: accountKey.all() });
    },
  });

  //// Update account
  const { mutate: update } = useMutation({
    mutationFn: (updatedAccount: UpdatedAccountFormType) =>
      updateAccount(updatedAccount),

    onMutate: async (newAccount, context) => {
      // Cancel Querying
      await context.client.cancelQueries({ queryKey: accountKey.all() });
      // Snapshot previous accounts
      const previousAccounts = context.client.getQueryData<Account[]>(accountKey.list());
      // Set optimistic account
      context.client.setQueryData<Account[]>(accountKey.list(), (old = []) =>
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
    onError: (err, _updatedAccount, onMutateResult, context) => {
      context.client.setQueryData(
        accountKey.list(),
        onMutateResult?.previousAccounts,
      );
      toast.error(err.message);
    },

    onSettled: (data, _error, _updatedAccount, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: accountKey.all() });
    },
  });

  //// Delete account
  const { mutate: remove } = useMutation({
    mutationFn: (accountId: string) => deleteAccount(accountId),
    onMutate: async (newId, context) => {
      // Cancel querying
      await context.client.cancelQueries({ queryKey: accountKey.all() });
      // Snapshot previous accounts
      const previousAccounts = context.client.getQueryData<Account[]>(accountKey.list());
      // Set optimistic accounts
      context.client.setQueryData<Account[]>(accountKey.list(), (old = []) =>
        old.filter((o) => o.id !== newId),
      );
      return { previousAccounts };
    },

    // Role back on error
    onError: (err, _accountId, onMutateResult, context) => {
      context.client.setQueryData(
        accountKey.list(),
        onMutateResult?.previousAccounts,
      );
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _accountId, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: accountKey.all() });
    },
  });

  return { create, update, remove };
}
