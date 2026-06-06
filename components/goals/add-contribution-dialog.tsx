"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { Field } from "@base-ui/react/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { goalContributionSchema, type GoalContributionType } from "@/lib/schemas/goalSchema";
import { useGoalMutations } from "@/hooks/useGoalMutations";
import { GoalPreviewBar } from "@/components/goals/goal-preview-bar";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

type AddContributionDialogProps = {
  goalId: string;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
};

export function AddContributionDialog({
  goalId,
  goalName,
  currentAmount,
  targetAmount,
}: AddContributionDialogProps) {
  const [open, setOpen] = useState(false);
  const { contribute } = useGoalMutations();

  const form = useForm<GoalContributionType>({
    resolver: zodResolver(goalContributionSchema),
    defaultValues: { amount: "" },
  });

  const rawAmount = useWatch({ control: form.control, name: "amount" });
  const delta = Math.max(parseFloat(rawAmount) || 0, 0);

  function handleSubmit(data: GoalContributionType) {
    contribute({ goalId, amount: data.amount });
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) form.reset();
    setOpen(next);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Add contribution"
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add contribution</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Adding to{" "}
              <span className="text-foreground font-medium">{goalName}</span>
            </p>
          </DialogHeader>

          <form
            id="add-contribution-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <GoalPreviewBar
              current={currentAmount}
              target={targetAmount}
              delta={delta}
            />

            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
                  <Field.Label className="text-sm font-medium">Amount</Field.Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    autoFocus
                    {...field}
                  />
                  {fieldState.error && (
                    <p className="text-destructive text-sm">{fieldState.error.message}</p>
                  )}
                </Field.Root>
              )}
            />
          </form>

          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit" form="add-contribution-form">
              {delta > 0 ? `Add ${fmt(delta)}` : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
