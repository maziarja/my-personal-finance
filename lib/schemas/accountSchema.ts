import z from "zod";

export const accountFormSchema = z.object({
  name: z.string().trim().min(1, "Account name is required").max(100),
  type: z.enum(
    ["CHECKING", "SAVING", "CREDIT_CARD", "CASH"],
    "Choose account type",
  ),
  balance: z
    .string()
    .min(1, "Balance is required")
    .refine((val) => !isNaN(Number(val)), "Balance must be a valid number"),
});

export type AccountFormType = z.infer<typeof accountFormSchema>;
