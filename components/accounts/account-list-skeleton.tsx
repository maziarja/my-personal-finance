import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AccountCardSkeleton() {
  return (
    <Card className="flex min-h-40 flex-col gap-0 p-0">
      <div className="flex items-start justify-between px-6 pt-6">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-1">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="size-7 rounded-md" />
        </div>
      </div>
      <div className="mt-auto flex items-end justify-between px-6 pb-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
    </Card>
  );
}

export function AccountListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AccountCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
