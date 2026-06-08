import { Target } from "lucide-react";
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog";

export function GoalsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-brand/8 border border-brand/15 flex size-12 items-center justify-center rounded-full">
        <Target className="text-brand size-5" />
      </div>
      <div>
        <p className="font-medium">No goals yet</p>
        <p className="text-muted-foreground text-sm">
          Set a savings target to start tracking your progress.
        </p>
      </div>
      <CreateGoalDialog />
    </div>
  );
}
