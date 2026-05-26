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

export function SignInForm() {
  const form = useForm();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4">
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
                  autoComplete="current-password"
                  {...field}
                />
                <Field.Error className="text-sm text-destructive">
                  {fieldState.error?.message}
                </Field.Error>
              </Field.Root>
            )}
          />

          <Button type="submit" className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
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
