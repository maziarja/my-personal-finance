import z from "zod";

export const budgetFormSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  monthlyLimit: z
    .string()
    .min(1, "Monthly limit is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Limit must be a positive number",
    ),
  month: z.string().min(1, "Please select a month"),
});

export const updatedBudgetFormSchema = z.object({
  id: z.string(),
  categoryId: z.string().min(1, "Please select a category"),
  monthlyLimit: z
    .string()
    .min(1, "Monthly limit is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Limit must be a positive number",
    ),
  month: z.string().min(1, "Please select a month"),
});

export type BudgetFormType = z.infer<typeof budgetFormSchema>;
export type UpdatedBudgetFormType = z.infer<typeof updatedBudgetFormSchema>;
