"use server";

import { getSession } from "@/lib/helpers/getSession";
import prisma from "@/lib/prisma";
import {
  ContributionType,
  goalContributionActionSchema,
  GoalContributionActionType,
  goalFormSchema,
  GoalFormType,
  updatedGoalFormSchema,
  UpdatedGoalFormType,
} from "@/lib/schemas/goalSchema";
import { revalidatePath } from "next/cache";

export async function getGoals() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });

    return goals.map((goal) => ({
      ...goal,
      currentAmount: goal.currentAmount.toNumber(),
      targetAmount: goal.targetAmount.toNumber(),
      deadline: goal.deadline?.toISOString() ?? null,
    }));
  } catch (error) {
    console.error(error);
    return { error: "Unable to get goals" };
  }
}

export async function createGoal(formData: GoalFormType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const parsed = goalFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { deadline, ...data } = parsed.data;
  try {
    await prisma.goal.create({
      data: {
        userId: session.user.id,
        currentAmount: 0,
        ...(deadline && { deadline: new Date(deadline) }),
        ...data,
      },
    });

    revalidatePath("/goals");
  } catch (error) {
    console.error(error);
    return { error: "Unable to create the goal" };
  }
}

export async function deleteGoal(goalId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  try {
    await prisma.goal.delete({
      where: { userId: session.user.id, id: goalId },
    });
    revalidatePath("/goals");
  } catch (error) {
    console.error(error);
    return { error: "Unable to delete the goal" };
  }
}

export async function updateGoal(
  formData: UpdatedGoalFormType & { currentAmount: number },
) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const parsed = updatedGoalFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, deadline, ...data } = parsed.data;
  try {
    await prisma.goal.update({
      where: { userId: session.user.id, id },
      data: {
        currentAmount: formData.currentAmount,
        ...(deadline && { deadline: new Date(deadline) }),
        ...data,
      },
    });

    revalidatePath("/goals");
  } catch (error) {
    console.error(error);
    return { error: "Unable to update the goal" };
  }
}

export async function contributeAction(
  formData: GoalContributionActionType,
  type: ContributionType,
) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const parsed = goalContributionActionSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { id, amount } = parsed.data;

  try {
    await prisma.goal.update({
      where: {
        userId: session.user.id,
        id,
        ...(type === ContributionType.Withdraw && {
          currentAmount: { gte: Number(amount) },
        }),
      },
      data: {
        currentAmount:
          type === ContributionType.Add
            ? { increment: Number(amount) }
            : { decrement: Number(amount) },
      },
    });

    revalidatePath("/goals");
  } catch (error) {
    console.error(error);
    return { error: "Unable to contribute the goal" };
  }
}
