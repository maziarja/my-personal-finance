"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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
import { type Budget, type BudgetCategory } from "@/components/budgets/budget-card";
import { useBudgetMutations } from "@/hooks/useBudgetMutations";

type EditBudgetDialogProps = {
  budget: Budget;
  categories: BudgetCategory[];
};

export function EditBudgetDialog({ budget, categories }: EditBudgetDialogProps) {
  const [open, setOpen] = useState(false);

  const { update } = useBudgetMutations();

  async function handleSubmit(
    data: BudgetFormType,
  ): Promise<void | { error: string }> {
    update({ ...data, id: budget.id });
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit budget"
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit budget</DialogTitle>
          </DialogHeader>
          <BudgetForm
            id="edit-budget-form"
            categories={categories}
            defaultValues={{
              categoryId: budget.categoryId,
              monthlyLimit: String(budget.monthlyLimit),
              month: budget.month,
            }}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit" form="edit-budget-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
