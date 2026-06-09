import z from "zod";

export const transactionFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), "Balance must be a valid number"),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryId: z.string().min(1, "Category is required"),
  to: z.string().trim().toLowerCase().max(222).optional(),
  financialAccountId: z.string().min(1, "Account is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(400).optional(),
});

export const acceptTransactionSchema = z.object({
  financialAccountId: z.string().min(1, "Account is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const acceptTransactionActionSchema = acceptTransactionSchema.extend({
  transactionId: z.uuid("Invalid transaction ID"),
});

export type TransactionFormType = z.infer<typeof transactionFormSchema>;
export type AcceptTransactionFormType = z.infer<typeof acceptTransactionSchema>;
export type AcceptTransactionActionType = z.infer<typeof acceptTransactionActionSchema>;
