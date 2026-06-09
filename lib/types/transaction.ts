import type {
  AccountType,
  TransactionStatus,
  TransactionType,
} from "@/app/generated/prisma/enums";

export type Transaction = {
  id: string;
  amount: string | number;
  type?: TransactionType;
  status?: TransactionStatus | null;
  date: string | Date;
  createdAt?: string | Date | null;
  notes?: string | null;
  from?: string | null;
  to?: string | null;
  category?: { id: string; name: string; color: string } | null;
  financialAccount?: { id: string; name: string; type: AccountType } | null;
};
