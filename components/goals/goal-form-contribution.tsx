"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@base-ui/react/field";
import { Input } from "@/components/ui/input";
import {
  goalContributionSchema,
  type GoalContributionType,
} from "@/lib/schemas/goalSchema";

type GoalContributionFormProps = {
  id: string;
  onSubmit: (data: GoalContributionType) => void | Promise<void>;
};

export function GoalContributionForm({ id, onSubmit }: GoalContributionFormProps) {
  const form = useForm<GoalContributionType>({
    resolver: zodResolver(goalContributionSchema),
    defaultValues: { amount: "" },
  });

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="amount"
        render={({ field, fieldState }) => (
          <Field.Root invalid={!!fieldState.error} className="flex flex-col gap-1.5">
            <Field.Label className="text-sm font-medium">Amount</Field.Label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              autoFocus
              {...field}
            />
            {fieldState.error && (
              <p className="text-destructive text-sm">{fieldState.error.message}</p>
            )}
          </Field.Root>
        )}
      />
    </form>
  );
}
