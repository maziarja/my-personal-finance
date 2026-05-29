"use server";

import { getSession } from "@/lib/helpers/getSession";
import prisma from "@/lib/prisma";
import {
  transactionFormSchema,
  TransactionFormType,
  updatedTransactionFormSchema,
  UpdatedTransactionFormType,
} from "@/lib/schemas/transactionSchema";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      include: {
        financialAccount: { select: { name: true, type: true, id: true } },
        category: { select: { id: true, color: true, name: true } },
      },
    });

    return transactions.map((trans) => ({
      ...trans,
      amount: trans.amount.toNumber(),
    }));
  } catch (error) {
    console.error(error);
    return { error: "Unable to get transactions" };
  }
}

export async function createTransaction(formData: TransactionFormType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const parsed = transactionFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { date, ...rest } = parsed.data;
  try {
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        ...rest,
      },
    });
    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return {
      error: "Unable to create transaction",
    };
  }
}

export async function updateTransaction(formData: UpdatedTransactionFormType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const parsed = updatedTransactionFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, date, ...rest } = parsed.data;
  try {
    await prisma.transaction.update({
      where: { userId: session.user.id, id },
      data: { date: new Date(date), ...rest },
    });
    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return { error: "Unable to create the transaction" };
  }
}

export async function deleteTransaction(transactionId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.transaction.delete({
      where: { userId: session.user.id, id: transactionId },
    });
    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return { error: "Unable to delete the transaction" };
  }
}
