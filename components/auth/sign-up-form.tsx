"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signUpSchema, SignUpType } from "@/lib/schemas/authSchema";
import { signUp } from "@/app/_actions/authActions";
import { Spinner } from "../ui/spinner";

export function SignUpForm() {
  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: SignUpType) {
    const result = await signUp(formData);
    if (result?.error) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <Card className="w-full max-w-sm border-t-2 border-t-brand/40">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Start tracking your finances today</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field.Root
                invalid={!!fieldState.error}
                className="flex flex-col gap-1.5"
              >
                <Field.Label className="text-foreground text-sm font-medium">
                  Name
                </Field.Label>
                <Input
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
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
                  autoComplete="new-password"
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
            {form.formState.isSubmitting ? <Spinner /> : "Create account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-muted-foreground justify-center text-sm">
        Already have an account?&nbsp;
        <Link
          href="/sign-in"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
