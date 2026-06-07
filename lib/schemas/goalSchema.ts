import z from "zod";

export const goalFormSchema = z.object({
  name: z.string().trim().min(1, "Goal name is required"),
  targetAmount: z
    .string()
    .min(1, "Target amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Must be a positive number",
    ),
  deadline: z.string().optional(),
});

export const updatedGoalFormSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Goal name is required"),
  targetAmount: z
    .string()
    .min(1, "Target amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Must be a positive number",
    ),
  deadline: z.string().optional(),
});

export const goalContributionSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Must be a positive number",
    ),
});

export const goalContributionActionSchema = goalContributionSchema.extend({
  id: z.string(),
});

export enum ContributionType {
  Withdraw,
  Add,
}

export type GoalFormType = z.infer<typeof goalFormSchema>;
export type UpdatedGoalFormType = z.infer<typeof updatedGoalFormSchema>;
export type GoalContributionType = z.infer<typeof goalContributionSchema>;
export type GoalContributionActionType = z.infer<
  typeof goalContributionActionSchema
>;
