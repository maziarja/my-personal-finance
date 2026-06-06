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
import { GoalForm } from "@/components/goals/goal-form";
import { type GoalFormType } from "@/lib/schemas/goalSchema";
import { type Goal } from "@/components/goals/goal-card";
import { useGoalMutations } from "@/hooks/useGoalMutations";

type EditGoalDialogProps = {
  goal: Goal;
};

export function EditGoalDialog({ goal }: EditGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const { update } = useGoalMutations();

  function handleSubmit(data: GoalFormType) {
    update({ ...data, id: goal.id });
    setOpen(false);
  }

  const defaultValues: Partial<GoalFormType> = {
    name: goal.name,
    targetAmount: String(goal.targetAmount),
    deadline: goal.deadline
      ? new Date(goal.deadline).toISOString().split("T")[0]
      : undefined,
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit goal"
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit goal</DialogTitle>
          </DialogHeader>
          <GoalForm
            id="edit-goal-form"
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit" form="edit-goal-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
