import z from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(100),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Please select a color"),
});

export const updatedCategoryFormSchema = z.object({
  id: z.string().max(200),
  name: z.string().trim().min(1, "Category name is required").max(100),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Please select a color"),
});

export type CategoryFormType = z.infer<typeof categoryFormSchema>;
export type UpdatedCategoryFormType = z.infer<typeof updatedCategoryFormSchema>;
