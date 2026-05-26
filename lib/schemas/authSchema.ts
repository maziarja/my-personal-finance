import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(8, "Password should be at least 8 chars"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name should be at least 2 chars"),
  email: z.email(),
  password: z.string().trim().min(8, "Password should be at least 8 chars"),
});

export type SignInType = z.infer<typeof signInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
