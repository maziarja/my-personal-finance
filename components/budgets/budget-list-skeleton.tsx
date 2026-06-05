import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function BudgetCardSkeleton() {
  return (
    <Card className="flex min-h-52 flex-col gap-0 p-0">
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="size-7 rounded-md" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center py-2">
        <Skeleton className="size-[120px] rounded-full" />
      </div>
      <div className="flex items-end justify-between px-5 pb-5">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function BudgetListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BudgetCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
