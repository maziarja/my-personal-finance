"use server";

import { getSession } from "@/lib/helpers/getSession";
import prisma from "@/lib/prisma";
import {
  categoryFormSchema,
  CategoryFormType,
  updatedCategoryFormSchema,
  UpdatedCategoryFormType,
} from "@/lib/schemas/categorySchema";
import { revalidatePath } from "next/cache";
import {
  Prisma,
  TransactionStatus,
  TransactionType,
} from "../generated/prisma/client";

export async function getCategories() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  try {
    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    console.error(error);
    return { error: "Unable to get categories" };
  }
}

export async function createCategory(formData: CategoryFormType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const parsed = categoryFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await prisma.category.create({
      data: { ...parsed.data, userId: session.user.id },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "You already have this category" };
    }
    return { error: "Unable to create a category" };
  }
}

export async function updateCategory(formData: UpdatedCategoryFormType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const parsed = updatedCategoryFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  try {
    const { id, ...updatedCategory } = parsed.data;
    await prisma.category.update({
      where: { userId: session.user.id, id },
      data: updatedCategory,
    });
    revalidatePath("/categories");
  } catch (error) {
    console.error(error);
    return { error: "Unable to update the category" };
  }
}

export async function deleteCategory(categoryId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  try {
    await prisma.category.delete({
      where: {
        userId: session.user.id,
        id: categoryId,
      },
    });
    revalidatePath("/categories");
  } catch (error) {
    console.error(error);
    return { error: "Unable to delete the category" };
  }
}

export async function getSpendingData() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();

  const startLastMonth = new Date(Date.UTC(y, m - 1, 1));
  const endLastMonth = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
  const startThisMonth = new Date(Date.UTC(y, m, 1));
  const endThisMonth = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));

  const [thisMonthSpendingTime, lastMonthSpendingTime] = await Promise.all([
    prisma.category.findMany({
      where: {
        userId: session.user.id,
        transactions: {
          some: {
            date: { gte: startThisMonth, lte: endThisMonth },
            status: TransactionStatus.COMPLETE,
            type: TransactionType.EXPENSE,
          },
        },
      },
      select: {
        color: true,
        name: true,
        transactions: {
          where: {
            date: { gte: startThisMonth, lte: endThisMonth },
            status: TransactionStatus.COMPLETE,
            type: TransactionType.EXPENSE,
          },
          select: { amount: true },
        },
      },
    }),
    prisma.category.findMany({
      where: {
        userId: session.user.id,
        transactions: {
          some: {
            date: { gte: startLastMonth, lte: endLastMonth },
            status: TransactionStatus.COMPLETE,
            type: TransactionType.EXPENSE,
          },
        },
      },
      select: {
        color: true,
        name: true,
        transactions: {
          where: {
            date: { gte: startLastMonth, lte: endLastMonth },
            status: TransactionStatus.COMPLETE,
            type: TransactionType.EXPENSE,
          },
          select: { amount: true },
        },
      },
    }),
  ]);

  const spendingMap = new Map<
    string,
    { category: string; color: string; thisMonth: number; lastMonth: number }
  >();

  for (const cat of thisMonthSpendingTime) {
    spendingMap.set(cat.name, {
      category: cat.name,
      color: cat.color,
      thisMonth: cat.transactions.reduce(
        (acc, cur) => acc + cur.amount.toNumber(),
        0,
      ),
      lastMonth: 0,
    });
  }

  for (const cat of lastMonthSpendingTime) {
    const lastMonth = cat.transactions.reduce(
      (acc, cur) => acc + cur.amount.toNumber(),
      0,
    );
    const existing = spendingMap.get(cat.name);
    if (existing) {
      existing.lastMonth = lastMonth;
    } else {
      spendingMap.set(cat.name, {
        category: cat.name,
        color: cat.color,
        thisMonth: 0,
        lastMonth,
      });
    }
  }

  return Array.from(spendingMap.values());
}
