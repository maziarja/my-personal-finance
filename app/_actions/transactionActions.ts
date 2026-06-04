"use server";

import { getSession } from "@/lib/helpers/getSession";
import prisma from "@/lib/prisma";
import {
  acceptTransactionActionSchema,
  type AcceptTransactionActionType,
  transactionFormSchema,
  type TransactionFormType,
} from "@/lib/schemas/transactionSchema";
import { revalidatePath } from "next/cache";
import { TransactionStatus, TransactionType } from "../generated/prisma/enums";
import { MINIMUM_TRANSACTION_AMOUNT } from "@/lib/const";

type ActiveFilters = {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  from?: string;
  to?: string;
};

export async function getTransactions(activeFilters: ActiveFilters) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        financialAccountId: activeFilters.accountId,
        categoryId: activeFilters.categoryId,
        type: activeFilters.type,
        date: {
          ...(activeFilters.from && { gte: new Date(activeFilters.from) }),
          ...(activeFilters.to && {
            lte: new Date(activeFilters.to + "T23:59:59Z"),
          }),
        },
      },

      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
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
  const { date, to, type, financialAccountId, categoryId, ...rest } =
    parsed.data;
  const p2pTransaction = to !== null && to !== undefined && to !== "";

  if (!categoryId) return { error: "Please select category" };
  if (!financialAccountId) return { error: "Please select account" };
  if (Number(rest.amount) < MINIMUM_TRANSACTION_AMOUNT)
    return { error: "Transaction amount is not valid" };

  const selectedAccount = await prisma.financialAccount.findFirst({
    where: { ownerId: session?.user.id, id: financialAccountId },
  });

  if (!selectedAccount) return { error: "Account not found" };

  if (
    type === TransactionType.EXPENSE &&
    Number(selectedAccount?.balance) < Number(rest.amount)
  )
    return { error: "You don't have enough balance in your account" };

  function adjustBalance(isP2p = false) {
    return prisma.financialAccount.update({
      where: { ownerId: session?.user.id, id: financialAccountId },
      data: {
        balance: !isP2p
          ? type === TransactionType.EXPENSE
            ? { decrement: Number(rest.amount) }
            : { increment: Number(rest.amount) }
          : { decrement: Number(rest.amount) },
      },
    });
  }

  try {
    if (!p2pTransaction) {
      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            userId: session.user.id,
            date: new Date(date),
            financialAccountId,
            status: TransactionStatus.COMPLETE,
            categoryId,
            type: type || TransactionType.EXPENSE,
            ...rest,
          },
        }),
        adjustBalance(false),
      ]);
    }

    if (p2pTransaction) {
      const transferId = crypto.randomUUID();
      const receiverUser = await prisma.user.findUnique({
        where: { email: to },
      });

      if (receiverUser === null) return { error: "User not found" };

      if (receiverUser.id === session.user.id)
        return { error: "You can't make a transaction for yourself." };

      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            userId: session.user.id,
            transferId,
            financialAccountId,
            categoryId,
            status: TransactionStatus.PENDING,
            date: new Date(date),
            to,
            type: TransactionType.EXPENSE,
            ...rest,
          },
        }),
        prisma.user.update({
          where: { email: to },
          data: {
            transactions: {
              create: {
                from: session.user.email,
                transferId,
                financialAccountId: null,
                categoryId: null,
                status: TransactionStatus.PENDING,
                date: new Date(date),
                type: TransactionType.INCOME,
                ...rest,
              },
            },
          },
        }),
      ]);
    }

    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return {
      error: "Unable to create transaction",
    };
  }
}

export async function deleteTransaction(transactionId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const selectedTransaction = await prisma.transaction.findUnique({
      where: { userId: session.user.id, id: transactionId },
      select: {
        financialAccountId: true,
        type: true,
        amount: true,
        transferId: true,
        to: true,
        status: true,
      },
    });

    if (!selectedTransaction) {
      return { error: "Transaction not found" };
    }

    if (selectedTransaction.transferId) {
      return { error: "P2P transactions cannot be deleted this way" };
    }

    await prisma.$transaction([
      // delete non-p2p transaction
      prisma.transaction.delete({
        where: {
          userId: session.user.id,
          id: transactionId,
          status: TransactionStatus.COMPLETE,
        },
      }),

      // restore non-p2p balance
      ...(selectedTransaction.financialAccountId
        ? [
            prisma.financialAccount.update({
              where: {
                ownerId: session?.user.id,
                id: selectedTransaction.financialAccountId!,
              },
              data: {
                balance:
                  selectedTransaction.type === TransactionType.EXPENSE
                    ? { increment: Number(selectedTransaction.amount) }
                    : { decrement: Number(selectedTransaction.amount) },
              },
            }),
          ]
        : []),
    ]);

    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return { error: "Unable to delete the transaction" };
  }
}

export async function acceptTransaction(formData: AcceptTransactionActionType) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const parsed = acceptTransactionActionSchema.safeParse(formData);
  if (!parsed.success)
    return {
      error: parsed.error.issues[0].message,
    };

  const { financialAccountId, categoryId, transactionId } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const receiverTransaction = await tx.transaction.findUnique({
        where: { userId: session.user.id, id: transactionId },
        select: { amount: true, transferId: true, from: true },
      });

      if (!receiverTransaction) return { error: "Transaction not found" };

      const senderTransaction = await tx.transaction.findFirst({
        where: {
          transferId: receiverTransaction?.transferId,
          user: {
            email: receiverTransaction.from!,
          },
        },
        select: {
          amount: true,
          transferId: true,
          financialAccountId: true,
          userId: true,
        },
      });

      if (!senderTransaction)
        return { error: "Something went wrong, contact us!" };

      // update receiver transaction
      await tx.transaction.update({
        where: {
          userId: session.user.id,
          id: transactionId,
          status: TransactionStatus.PENDING,
        },
        data: {
          status: TransactionStatus.COMPLETE,
          categoryId,
          financialAccountId,
        },
      });
      // update receiver account
      await tx.financialAccount.update({
        where: {
          ownerId: session.user.id,
          id: financialAccountId,
        },
        data: {
          balance: { increment: Number(receiverTransaction.amount) },
        },
      });

      // update sender transaction
      await tx.transaction.updateMany({
        where: {
          transferId: receiverTransaction.transferId,
          user: {
            email: receiverTransaction.from!,
          },
        },
        data: {
          status: TransactionStatus.COMPLETE,
        },
      });

      // update sender balance account
      await tx.financialAccount.update({
        where: {
          id: senderTransaction.financialAccountId!,
          ownerId: senderTransaction.userId,
        },
        data: { balance: { decrement: senderTransaction.amount } },
      });
    });

    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return { error: "Unable to accept this transaction" };
  }
}

export async function cancelTransaction(transactionId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: {
          userId: session.user.id,
          id: transactionId,
          status: TransactionStatus.PENDING,
        },
        select: { transferId: true, to: true },
      });

      if (!transaction) return { error: "Transaction not found" };

      // update senderTransaction
      await tx.transaction.update({
        where: {
          id: transactionId,
          userId: session.user.id,
          status: TransactionStatus.PENDING,
        },
        data: { status: TransactionStatus.CANCELED },
      });
      // update receiverTransaction
      await tx.transaction.updateMany({
        where: {
          status: TransactionStatus.PENDING,
          transferId: transaction?.transferId,
          user: { email: transaction.to! },
        },
        data: { status: TransactionStatus.CANCELED },
      });
    });

    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return { error: "Unable to cancel the transaction" };
  }
}

export async function rejectTransaction(transactionId: string) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: {
          userId: session.user.id,
          id: transactionId,
          status: TransactionStatus.PENDING,
        },
        select: { transferId: true, from: true },
      });

      if (!transaction) return { error: "Transaction not found" };

      // update receiverTransaction
      await tx.transaction.update({
        where: {
          id: transactionId,
          userId: session.user.id,
          status: TransactionStatus.PENDING,
        },
        data: { status: TransactionStatus.REJECTED },
      });
      // update senderTransaction
      await tx.transaction.updateMany({
        where: {
          status: TransactionStatus.PENDING,
          transferId: transaction?.transferId,
          user: { email: transaction.from! },
        },
        data: { status: TransactionStatus.REJECTED },
      });
    });

    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    return { error: "Unable to reject the transaction" };
  }
}
