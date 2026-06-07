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
import { GoalForm } from "@/components/goals/goal-form";
import { type GoalFormType } from "@/lib/schemas/goalSchema";
import { useGoalMutations } from "@/hooks/useGoalMutations";

export function CreateGoalDialog() {
  const [open, setOpen] = useState(false);
  const { create } = useGoalMutations();

  function handleSubmit(data: GoalFormType) {
    create(data);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="size-4" />
        Add goal
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add goal</DialogTitle>
          </DialogHeader>
          <GoalForm id="create-goal-form" onSubmit={handleSubmit} />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="create-goal-form">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
