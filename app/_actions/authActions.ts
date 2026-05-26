"use server";

import { auth } from "@/lib/auth";
import {
  signInSchema,
  SignInType,
  signUpSchema,
  SignUpType,
} from "@/lib/schemas/authSchema";
import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: SignInType) => {
  const parsed = signInSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    if (isAPIError(error)) {
      return { error: "Invalid email or password." };
    }
    return { error: "Something went wrong. Please try again." };
  }
  redirect("/dashboard");
};

export const signUp = async (formData: SignUpType) => {
  const parsed = signUpSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { name, email, password } = parsed.data;
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    if (isAPIError(error)) {
      return { error: error.message };
    }
    return { error: "Something went wrong. Please try again." };
  }
  redirect("/dashboard");
};

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}
