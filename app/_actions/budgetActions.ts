"use server";

import { getSession } from "@/lib/helpers/getSession";
import prisma from "@/lib/prisma";
import {
  budgetFormSchema,
  type BudgetFormType,
  updatedBudgetFormSchema,
  type UpdatedBudgetFormType,
} from "@/lib/schemas/budgetSchema";
import { revalidatePath } from "next/cache";
import { TransactionStatus, TransactionType } from "../generated/prisma/enums";

export type BudgetRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  monthlyLimit: number;
  spentAmount: number;
  month: string;
};

export async function getBudgets(): Promise<BudgetRow[] | { error: string }> {
  const session = await getSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: [{ month: "desc" }, { category: { name: "asc" } }],
    });

    if (budgets.length === 0) return [];

    const months = budgets.map((b) => b.month);
    const startDate = new Date(
      Date.UTC(
        Math.min(...months.map((m) => m.getUTCFullYear())),
        Math.min(...months.map((m) => m.getUTCMonth())),
        1,
      ),
    );
    const endDate = new Date(
      Date.UTC(
        Math.max(...months.map((m) => m.getUTCFullYear())),
        Math.max(...months.map((m) => m.getUTCMonth())) + 1,
        0,
        23,
        59,
        59,
        999,
      ),
    );

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        status: TransactionStatus.COMPLETE,
        type: TransactionType.EXPENSE,
        date: { gte: startDate, lte: endDate },
      },
      select: { categoryId: true, amount: true, date: true },
    });

    return budgets.map((b) => {
      const filteredTransaction = transactions.filter((tran) => {
        return (
          tran.categoryId === b.categoryId &&
          tran.date.getUTCMonth() === b.month.getUTCMonth() &&
          tran.date.getUTCFullYear() === b.month.getUTCFullYear()
        );
      });

      const spentAmount = filteredTransaction.reduce(
        (acc, cur) => acc + Number(cur.amount),
        0,
      );

      return {
        id: b.id,
        categoryId: b.categoryId,
        categoryColor: b.category.color,
        categoryName: b.category.name,
        monthlyLimit: Number(b.monthlyLimit),
        spentAmount,
        month: b.month.toISOString().slice(0, 7),
      };
    });
  } catch (error) {
    console.error(error);
    return { error: "Unable to get budgets" };
  }
}

export async function createBudget(formData: BudgetFormType) {
  const session = await getSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  const parsed = budgetFormSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.budget.create({
      data: {
        categoryId: parsed.data.categoryId,
        monthlyLimit: Number(parsed.data.monthlyLimit),
        month: new Date(parsed.data.month + "-01"),
        userId: session.user.id,
      },
    });
    revalidatePath("/budgets");
  } catch (error) {
    console.error(error);
    return { error: "Unable to create budget" };
  }
}

export async function updateBudget(formData: UpdatedBudgetFormType) {
  const session = await getSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  const parsed = updatedBudgetFormSchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const { id, ...data } = parsed.data;
    await prisma.budget.update({
      where: { id, userId: session.user.id },
      data: {
        categoryId: data.categoryId,
        monthlyLimit: Number(data.monthlyLimit),
        month: new Date(data.month + "-01"),
      },
    });
    revalidatePath("/budgets");
  } catch (error) {
    console.error(error);
    return { error: "Unable to update budget" };
  }
}

export async function deleteBudget(id: string) {
  const session = await getSession();
  if (!session || !session.user) throw new Error("Unauthorized");

  try {
    await prisma.budget.delete({ where: { id, userId: session.user.id } });
    revalidatePath("/budgets");
  } catch (error) {
    console.error(error);
    return { error: "Unable to delete budget" };
  }
}
