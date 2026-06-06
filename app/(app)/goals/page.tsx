import { getGoals } from "@/app/_actions/goalActions";
import { GoalList } from "@/components/goals/goal-list";
import { getQueryClient } from "@/lib/helpers/get-query-client";
import { goalKey } from "@/lib/query-keys/goals";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function GoalsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: goalKey.list(),
    queryFn: getGoals,
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-brand/45 border-l-2 pl-3">
        <h1 className="text-2xl font-semibold">Goals</h1>
        <p className="text-muted-foreground text-sm">
          Track your savings targets
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GoalList />
      </HydrationBoundary>
    </div>
  );
}
