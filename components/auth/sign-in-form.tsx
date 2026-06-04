"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { Field } from "@base-ui/react/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema, SignInType } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/app/_actions/authActions";
import { Spinner } from "../ui/spinner";

export function SignInForm() {
  const form = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: SignInType) {
    const result = await signIn(formData);
    if (result?.error) form.setError("root", { message: result.error });
  }

  return (
    <Card className="w-full max-w-sm border-t-2 border-t-brand/[0.4]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field.Root
                invalid={!!fieldState.error}
                className="flex flex-col gap-1.5"
              >
                <Field.Label className="text-foreground text-sm font-medium">
                  Email
                </Field.Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field.Root>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field.Root
                invalid={!!fieldState.error}
                className="flex flex-col gap-1.5"
              >
                <Field.Label className="text-foreground text-sm font-medium">
                  Password
                </Field.Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field.Root>
            )}
          />
          {form.formState.errors.root && (
            <p className="text-destructive text-sm">
              {form.formState.errors.root.message}
            </p>
          )}
          <Button type="submit" className="mt-2 w-full">
            {form.formState.isSubmitting ? <Spinner /> : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-muted-foreground justify-center text-sm">
        Don&apos;t have an account?&nbsp;
        <Link
          href="/sign-up"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
