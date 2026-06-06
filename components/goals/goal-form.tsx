"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@base-ui/react/field";
import { Input } from "@/components/ui/input";
import { goalFormSchema, type GoalFormType } from "@/lib/schemas/goalSchema";

type GoalFormProps = {
  id: string;
  defaultValues?: Partial<GoalFormType>;
  onSubmit: (data: GoalFormType) => void | Promise<void>;
};

export function GoalForm({ id, defaultValues, onSubmit }: GoalFormProps) {
  const form = useForm<GoalFormType>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      targetAmount: defaultValues?.targetAmount ?? "",
      deadline: defaultValues?.deadline ?? "",
    },
  });

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
            <Field.Label className="text-sm font-medium">Goal name</Field.Label>
            <Input placeholder="e.g. Emergency fund" {...field} />
            {fieldState.error && (
              <p className="text-destructive text-sm">{fieldState.error.message}</p>
            )}
          </Field.Root>
        )}
      />

      <Controller
        control={form.control}
        name="targetAmount"
        render={({ field, fieldState }) => (
          <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
            <Field.Label className="text-sm font-medium">Target amount</Field.Label>
            <Input type="number" min="0.01" step="0.01" placeholder="0.00" {...field} />
            {fieldState.error && (
              <p className="text-destructive text-sm">{fieldState.error.message}</p>
            )}
          </Field.Root>
        )}
      />

      <Controller
        control={form.control}
        name="deadline"
        render={({ field, fieldState }) => (
          <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
            <Field.Label className="text-sm font-medium">
              Deadline{" "}
              <span className="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </Field.Label>
            <Input type="date" {...field} />
            {fieldState.error && (
              <p className="text-destructive text-sm">{fieldState.error.message}</p>
            )}
          </Field.Root>
        )}
      />

      {form.formState.errors.root && (
        <p className="text-destructive text-sm">
          {form.formState.errors.root.message}
        </p>
      )}
    </form>
  );
}
