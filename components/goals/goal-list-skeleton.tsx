import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function GoalCardSkeleton() {
  return (
    <Card className="flex min-h-52 flex-col gap-0 p-0">
      <div className="flex items-start justify-between px-5 pt-5">
        <Skeleton className="h-5 w-32 rounded" />
        <div className="flex items-center gap-1">
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-4 gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-8 rounded" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      <div className="flex items-end justify-between px-5 pb-5">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function GoalListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <GoalCardSkeleton key={i} />
      ))}
    </div>
  );
}
