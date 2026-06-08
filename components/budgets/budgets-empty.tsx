import { PiggyBank } from "lucide-react";
import { CreateBudgetDialog } from "@/components/budgets/create-budget-dialog";
import type { BudgetCategory } from "@/components/budgets/budget-card";
import type { Transaction } from "@/components/transactions/transaction-table";

type BudgetsEmptyProps = {
  categories: BudgetCategory[];
  transactions: Transaction[];
};

export function BudgetsEmpty({ categories, transactions }: BudgetsEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-brand/8 border border-brand/15 flex size-12 items-center justify-center rounded-full">
        <PiggyBank className="text-brand size-5" />
      </div>
      <div>
        <p className="font-medium">No budgets yet</p>
        <p className="text-muted-foreground text-sm">
          Set a monthly limit for a category to start tracking your spending.
        </p>
      </div>
      <CreateBudgetDialog categories={categories} transactions={transactions} />
    </div>
  );
}
