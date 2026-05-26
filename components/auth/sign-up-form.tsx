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

export function SignUpForm() {
  const form = useForm();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Start tracking your finances today</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
                <Field.Label className="text-sm font-medium text-foreground">
                  Name
                </Field.Label>
                <Input
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  {...field}
                />
                <Field.Error className="text-sm text-destructive">
                  {fieldState.error?.message}
                </Field.Error>
              </Field.Root>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
                <Field.Label className="text-sm font-medium text-foreground">
                  Email
                </Field.Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
                <Field.Error className="text-sm text-destructive">
                  {fieldState.error?.message}
                </Field.Error>
              </Field.Root>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
                <Field.Label className="text-sm font-medium text-foreground">
                  Password
                </Field.Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
                <Field.Error className="text-sm text-destructive">
                  {fieldState.error?.message}
                </Field.Error>
              </Field.Root>
            )}
          />

          <Button type="submit" className="mt-2 w-full">
            Create account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
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
