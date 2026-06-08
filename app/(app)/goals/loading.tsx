import { GoalListSkeleton } from "@/components/goals/goal-list-skeleton";

export default function GoalsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-brand/45 border-l-2 pl-3">
        <h1 className="text-2xl font-semibold">Goals</h1>
        <p className="text-muted-foreground text-sm">Track your savings targets</p>
      </div>
      <GoalListSkeleton />
    </div>
  );
}
