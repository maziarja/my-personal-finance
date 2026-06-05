"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { BudgetForm } from "@/components/budgets/budget-form";
import { type BudgetFormType } from "@/lib/schemas/budgetSchema";
import { type BudgetCategory } from "@/components/budgets/budget-card";
import { useBudgetMutations } from "@/hooks/useBudgetMutations";
import { CategoryOption } from "../transactions/transaction-form";
import { Transaction } from "../transactions/transaction-table";
import {
  TransactionStatus,
  TransactionType,
} from "@/app/generated/prisma/enums";

type CreateBudgetDialogProps = {
  categories: BudgetCategory[];
  transactions: Transaction[];
};

export function CreateBudgetDialog({
  categories,
  transactions,
}: CreateBudgetDialogProps) {
  const [open, setOpen] = useState(false);

  const { create } = useBudgetMutations();

  async function handleSubmit(
    data: BudgetFormType,
    category: CategoryOption,
  ): Promise<void | { error: string }> {
    const spentAmount = transactions
      .filter(
        (transaction) =>
          transaction.category?.id === category.id &&
          transaction.status === TransactionStatus.COMPLETE &&
          transaction.type === TransactionType.EXPENSE &&
          new Date(transaction.date).getUTCMonth() ===
            new Date(data.month).getUTCMonth() &&
          new Date(transaction.date).getUTCFullYear() ===
            new Date(data.month).getUTCFullYear(),
      )
      .reduce((acc, cur) => acc + Number(cur.amount), 0);

    create({ data, category, spentAmount });
    setOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        disabled={categories.length === 0}
      >
        <Plus className="size-4" />
        Add budget
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add budget</DialogTitle>
          </DialogHeader>
          <BudgetForm
            id="create-budget-form"
            categories={categories}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="create-budget-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
