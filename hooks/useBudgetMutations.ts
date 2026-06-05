"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { budgetKey } from "@/lib/query-keys/budgets";
import type { BudgetRow } from "@/app/_actions/budgetActions";
import {
  createBudget,
  deleteBudget,
  updateBudget,
} from "@/app/_actions/budgetActions";
import type {
  BudgetFormType,
  UpdatedBudgetFormType,
} from "@/lib/schemas/budgetSchema";
import { CategoryOption } from "@/components/transactions/transaction-form";

export function useBudgetMutations() {
  const { mutate: create } = useMutation({
    mutationFn: ({
      data,
    }: {
      data: BudgetFormType;
      category: CategoryOption;
      spentAmount: number;
    }) => createBudget(data),
    onMutate: async ({ data, category, spentAmount }, context) => {
      await context.client.cancelQueries({ queryKey: budgetKey.all() });
      const previousBudgets = context.client.getQueryData<BudgetRow[]>(
        budgetKey.list(),
      );

      const optimisticBudget = {
        id: crypto.randomUUID(),
        categoryName: category.name,
        categoryColor: category.color,
        spentAmount,
        ...{ ...data, monthlyLimit: Number(data.monthlyLimit) },
      };
      context.client.setQueryData<BudgetRow[]>(budgetKey.list(), (old = []) =>
        [...old, optimisticBudget].sort((a, b) => {
          const monthDiff =
            new Date(b.month).getTime() - new Date(a.month).getTime();
          if (monthDiff !== 0) return monthDiff;
          return a.categoryName.localeCompare(b.categoryName);
        }),
      );

      return { previousBudgets };
    },
    onError: (err, _data, onMutateResult, context) => {
      context.client.setQueryData(
        budgetKey.list(),
        onMutateResult?.previousBudgets,
      );
      toast.error(err.message);
    },
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) toast.error(data.error);
      return context.client.invalidateQueries({ queryKey: budgetKey.all() });
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: (data: UpdatedBudgetFormType) => updateBudget(data),
    onMutate: async (updated, context) => {
      await context.client.cancelQueries({ queryKey: budgetKey.all() });
      const previousBudgets = context.client.getQueryData<BudgetRow[]>(
        budgetKey.list(),
      );
      context.client.setQueryData<BudgetRow[]>(budgetKey.list(), (old = []) =>
        old
          .map((b) =>
            b.id === updated.id
              ? {
                  ...b,
                  monthlyLimit: Number(updated.monthlyLimit),
                  month: updated.month,
                }
              : b,
          )
          .sort((a, b) => {
            const monthDiff =
              new Date(b.month).getTime() - new Date(a.month).getTime();
            if (monthDiff !== 0) return monthDiff;
            return a.categoryName.localeCompare(b.categoryName);
          }),
      );
      return { previousBudgets };
    },
    onError: (err, _data, onMutateResult, context) => {
      context.client.setQueryData(
        budgetKey.list(),
        onMutateResult?.previousBudgets,
      );
      toast.error(err.message);
    },
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) toast.error(data.error);
      return context.client.invalidateQueries({ queryKey: budgetKey.all() });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onMutate: async (id, context) => {
      await context.client.cancelQueries({ queryKey: budgetKey.all() });
      const previousBudgets = context.client.getQueryData<BudgetRow[]>(
        budgetKey.list(),
      );
      context.client.setQueryData<BudgetRow[]>(budgetKey.list(), (old = []) =>
        old.filter((b) => b.id !== id),
      );
      return { previousBudgets };
    },
    onError: (err, _id, onMutateResult, context) => {
      context.client.setQueryData(
        budgetKey.list(),
        onMutateResult?.previousBudgets,
      );
      toast.error(err.message);
    },
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) toast.error(data.error);
      return context.client.invalidateQueries({ queryKey: budgetKey.all() });
    },
  });

  return { create, update, remove };
}
