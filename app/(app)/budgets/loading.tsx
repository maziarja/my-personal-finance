import { BudgetListSkeleton } from "@/components/budgets/budget-list-skeleton";

export default function BudgetsLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="border-l-2 border-brand/45 pl-3">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <p className="text-muted-foreground text-sm">
          Set monthly spending limits per category
        </p>
      </div>
      <BudgetListSkeleton />
    </div>
  );
}
