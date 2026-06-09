import {
  contributeAction,
  createGoal,
  deleteGoal,
  updateGoal,
} from "@/app/_actions/goalActions";
import { Goal } from "@/lib/types/goal";
import { goalKey } from "@/lib/query-keys/goals";
import {
  ContributionType,
  GoalContributionActionType,
  UpdatedGoalFormType,
} from "@/lib/schemas/goalSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGoalMutations() {
  const { mutate: create } = useMutation({
    mutationFn: createGoal,
    onMutate: async (data, context) => {
      // cancel all querying
      await context.client.cancelQueries({ queryKey: goalKey.all() });
      // snapshot of prev goal list
      const previous = context.client.getQueryData<Goal[]>(goalKey.list());
      // set optimistic goal
      const optimisticGoal: Goal = {
        id: crypto.randomUUID(),
        currentAmount: 0,
        ...data,
        deadline: data.deadline?.toString() || null,
        targetAmount: Number(data.targetAmount),
      };

      context.client.setQueryData<Goal[]>(goalKey.list(), (old = []) =>
        [...old, optimisticGoal].sort((a, b) => a.name.localeCompare(b.name)),
      );

      return { previous };
    },

    // Role back on error
    onError: (err, _newGoal, onMutateResult, context) => {
      context.client.setQueryData(goalKey.list(), onMutateResult?.previous);
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: goalKey.all() });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (goalId: string) => deleteGoal(goalId),
    onMutate: async (goalId, context) => {
      // cancel all querying
      await context.client.cancelQueries({ queryKey: goalKey.all() });
      // snapshot of prev goal list
      const previous = context.client.getQueryData<Goal[]>(goalKey.list());

      context.client.setQueryData<Goal[]>(goalKey.list(), (old = []) =>
        old.filter((o) => o.id !== goalId),
      );

      return { previous };
    },

    // Role back on error
    onError: (err, _newGoal, onMutateResult, context) => {
      context.client.setQueryData(goalKey.list(), onMutateResult?.previous);
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: goalKey.all() });
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: (data: UpdatedGoalFormType & { currentAmount: number }) =>
      updateGoal(data),
    onMutate: async (data, context) => {
      // cancel all querying
      await context.client.cancelQueries({ queryKey: goalKey.all() });
      // snapshot of prev goal list
      const previous = context.client.getQueryData<Goal[]>(goalKey.list());
      // set optimistic goal
      const optimisticGoal: Goal = {
        ...data,
        currentAmount: data.currentAmount,
        deadline: data.deadline ?? null,
        targetAmount: Number(data.targetAmount),
      };

      context.client.setQueryData<Goal[]>(goalKey.list(), (old = []) => {
        return old
          .map((o) => (o.id === data.id ? { ...o, ...optimisticGoal } : o))
          .sort((a, b) => a.name.localeCompare(b.name));
      });

      return { previous };
    },

    // Role back on error
    onError: (err, _newGoal, onMutateResult, context) => {
      context.client.setQueryData(goalKey.list(), onMutateResult?.previous);
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: goalKey.all() });
    },
  });

  const { mutate: contribute } = useMutation({
    mutationFn: ({
      type,
      data,
    }: {
      type: ContributionType;
      data: GoalContributionActionType;
    }) => contributeAction(data, type),
    onMutate: async ({ type, data }, context) => {
      // cancel all querying
      await context.client.cancelQueries({ queryKey: goalKey.all() });
      // snapshot of prev goal list
      const previous = context.client.getQueryData<Goal[]>(goalKey.list());

      context.client.setQueryData<Goal[]>(goalKey.list(), (old = []) => {
        return old
          .map((o) =>
            o.id === data.id
              ? {
                  ...o,
                  currentAmount:
                    type === ContributionType.Add
                      ? o.currentAmount + Number(data.amount)
                      : o.currentAmount - Number(data.amount),
                }
              : o,
          )
          .sort((a, b) => a.name.localeCompare(b.name));
      });

      return { previous };
    },

    // Role back on error
    onError: (err, _newGoal, onMutateResult, context) => {
      context.client.setQueryData(goalKey.list(), onMutateResult?.previous);
      toast.error(err.message);
    },

    // Updated data on success
    onSettled: (data, _error, _variable, _onMutateResult, context) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      return context.client.invalidateQueries({ queryKey: goalKey.all() });
    },
  });

  return { create, update, remove, contribute };
}
