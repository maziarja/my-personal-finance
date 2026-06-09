"use client";

import { useQuery } from "@tanstack/react-query";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalListSkeleton } from "@/components/goals/goal-list-skeleton";
import { GoalsEmpty } from "@/components/goals/goals-empty";
import { GoalsError } from "@/components/goals/goals-error";
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog";
import { goalKey } from "@/lib/query-keys/goals";
import { getGoals } from "@/app/_actions/goalActions";

export function GoalList() {
  const {
    data: goals,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: goalKey.list(),
    queryFn: getGoals,
  });

  if (isPending) return <GoalListSkeleton />;

  if (isError || (goals && "error" in goals)) {
    return <GoalsError onRetry={refetch} />;
  }

  if (!goals || goals.length === 0) {
    return <GoalsEmpty />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {goals.length} {goals.length === 1 ? "goal" : "goals"}
        </p>
        <CreateGoalDialog />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
