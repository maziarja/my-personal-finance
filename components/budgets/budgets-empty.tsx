import { PiggyBank } from "lucide-react";
import { CreateBudgetDialog } from "@/components/budgets/create-budget-dialog";
import type { BudgetCategory } from "@/components/budgets/budget-card";

type BudgetsEmptyProps = {
  categories: BudgetCategory[];
};

export function BudgetsEmpty({ categories }: BudgetsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-muted flex size-12 items-center justify-center rounded-full">
        <PiggyBank className="text-muted-foreground size-6" />
      </div>
      <div>
        <p className="font-medium">No budgets yet</p>
        <p className="text-muted-foreground text-sm">
          Set a monthly limit for a category to start tracking your spending.
        </p>
      </div>
      <CreateBudgetDialog categories={categories} />
    </div>
  );
}
