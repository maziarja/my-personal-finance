import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-brand/45 border-l-2 pl-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Your financial snapshot at a glance</p>
      </div>
      <DashboardSkeleton />
    </div>
  );
}
