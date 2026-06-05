"use server";

import { getSession } from "@/lib/helpers/getSession";
import prisma from "@/lib/prisma";
import {
  accountFormSchema,
  type AccountFormType,
  updatedAccountFormSchema,
  type UpdatedAccountFormType,
} from "@/lib/schemas/accountSchema";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

export async function getAccounts() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  try {
    const accounts = await prisma.financialAccount.findMany({
      where: { ownerId: session.user.id },
      orderBy: { name: "asc" },
    });
    return accounts.map((acc) => ({
      ...acc,
      balance: acc.balance.toNumber(),
    }));
  } catch (error) {
    console.error(error);
    return { error: "Unable to get accounts" };
  }
}

export async function createAccount(formData: AccountFormType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const parsed = accountFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (Number(parsed.data.balance) < 1) {
    return { error: "Balance must be at least one dollar" };
  }

  try {
    await prisma.financialAccount.create({
      data: {
        ...parsed.data,
        ownerId: session.user.id,
      },
    });
  } catch (error) {
    console.error(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "You already have this account" };
    }

    return { error: "Unable to create account" };
  }

  revalidatePath("/accounts");
}

export async function updateAccount(formData: UpdatedAccountFormType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const parsed = updatedAccountFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (Number(parsed.data.balance) < 1) {
    return { error: "Balance must be at least one dollar" };
  }

  try {
    const { id, ...updateData } = parsed.data;
    await prisma.financialAccount.update({
      where: { id, ownerId: session.user.id },
      data: updateData,
    });
  } catch (error) {
    console.error(error);
    return { error: "Unable to update this account" };
  }

  revalidatePath("/accounts");
}

export async function deleteAccount(id: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.financialAccount.delete({
      where: { ownerId: session.user.id, id },
    });
  } catch (error) {
    console.error(error);
    return { error: "Unable to delete this account" };
  }

  revalidatePath("/accounts");
}
