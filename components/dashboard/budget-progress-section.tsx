import Link from "next/link";
import { PiggyBank, ArrowRight } from "lucide-react";
import {
  BudgetCard,
  type Budget,
  type BudgetCategory,
} from "@/components/budgets/budget-card";
import { buttonVariants } from "@/lib/variants/button";
import { cn } from "@/lib/utils";
import { BudgetsError } from "../budgets/budgets-error";

type BudgetProgressSectionProps = {
  budgets: Budget[] | { error: string } | undefined;
  categories: BudgetCategory[] | { error: string } | undefined;
};

export function BudgetProgressSection({
  budgets,
  categories,
}: BudgetProgressSectionProps) {
  if (!Array.isArray(budgets) || !Array.isArray(categories))
    return <BudgetsError />;

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-10 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <PiggyBank className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="font-medium">No budgets yet</p>
          <p className="text-muted-foreground text-sm">
            Set a monthly limit for a category to track spending.
          </p>
        </div>
        <Link
          href="/budgets"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5",
          )}
        >
          Set up budgets <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} categories={categories} />
      ))}
    </div>
  );
}
