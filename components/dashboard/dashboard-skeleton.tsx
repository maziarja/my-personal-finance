import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AccountCardSkeleton() {
  return (
    <Card className="flex min-h-40 flex-col gap-0 p-0">
      <div className="flex items-start justify-between px-6 pt-6">
        <Skeleton className="h-5 w-28 rounded" />
        <div className="flex gap-1">
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
        </div>
      </div>
      <div className="mt-auto flex items-end justify-between px-6 pb-6">
        <Skeleton className="h-8 w-24 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
      </div>
    </Card>
  );
}

function BudgetCardSkeleton() {
  return (
    <Card className="flex min-h-52 flex-col gap-0 p-0">
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-5 w-24 rounded" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="size-7 rounded" />
          <Skeleton className="size-7 rounded" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center py-2">
        <Skeleton className="size-30 rounded-full" />
      </div>
      <div className="flex items-end justify-between px-5 pb-5">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
    </Card>
  );
}

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3 last:border-0">
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="ml-auto h-4 w-16 rounded" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Skeleton className="h-3 w-16 rounded" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <AccountCardSkeleton key={i} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-3 w-52 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-75 w-full rounded-lg" />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28 rounded" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <BudgetCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-3 w-36 rounded" />
        <div className="rounded-xl border">
          {Array.from({ length: 5 }).map((_, i) => (
            <TransactionRowSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
