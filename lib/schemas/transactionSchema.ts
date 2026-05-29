import z from "zod";

export const transactionFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), "Balance must be a valid number"),
  type: z.enum(["INCOME", "EXPENSE"], { error: "Type is required" }),
  categoryId: z.string().min(1, "Category is required"),
  financialAccountId: z.string().min(1, "Account is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(400).optional(),
});

export const updatedTransactionFormSchema = transactionFormSchema.extend({
  id: z.string().min(1),
});

export type TransactionFormType = z.infer<typeof transactionFormSchema>;
export type UpdatedTransactionFormType = z.infer<
  typeof updatedTransactionFormSchema
>;
