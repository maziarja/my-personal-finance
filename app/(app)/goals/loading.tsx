import { GoalListSkeleton } from "@/components/goals/goal-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-brand/45 border-l-2 pl-3">
        <Skeleton className="h-7 w-20 rounded" />
        <Skeleton className="mt-1 h-4 w-44 rounded" />
      </div>
      <GoalListSkeleton />
    </div>
  );
}
