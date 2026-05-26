import z from "zod";

export const signInSchema = z.object({
  email: z.email().max(254),
  password: z
    .string()
    .trim()
    .min(8, "Password should be at least 8 chars")
    .max(128),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name should be at least 2 chars").max(100),
  email: z.email().max(254),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
