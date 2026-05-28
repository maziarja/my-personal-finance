"use client";

import {
  Landmark,
  PiggyBank,
  CreditCard,
  Banknote,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EditAccountDialog } from "@/components/accounts/edit-account-dialog";
import { DeleteAccountDialog } from "@/components/accounts/delete-account-dialog";

export type Account = {
  id: string;
  name: string;
  type: "CHECKING" | "SAVING" | "CREDIT_CARD" | "CASH";
  balance: number;
};

const TYPE_CONFIG: Record<
  Account["type"],
  {
    label: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    labelColor: string;
  }
> = {
  CHECKING: {
    label: "Checking",
    icon: Landmark,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    labelColor: "text-blue-600 dark:text-blue-400",
  },
  SAVING: {
    label: "Saving",
    icon: PiggyBank,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    labelColor: "text-emerald-600 dark:text-emerald-400",
  },
  CREDIT_CARD: {
    label: "Credit Card",
    icon: CreditCard,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    labelColor: "text-orange-600 dark:text-orange-400",
  },
  CASH: {
    label: "Cash",
    icon: Banknote,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    labelColor: "text-violet-600 dark:text-violet-400",
  },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

type AccountCardProps = {
  account: Account;
  className?: string;
};

export function AccountCard({ account, className }: AccountCardProps) {
  const config = TYPE_CONFIG[account.type];
  const Icon = config.icon;

  return (
    <Card className={cn("flex min-h-40 flex-col gap-0 p-0", className)}>
      <div className="flex items-start justify-between px-6 pt-6">
        <p className="text-xl font-semibold capitalize">{account.name}</p>
        <div className="flex items-center gap-1">
          <EditAccountDialog account={account} />
          <DeleteAccountDialog
            accountId={account.id}
            accountName={account.name}
          />
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between px-6 pb-6">
        <p
          className={cn(
            "text-2xl font-bold tracking-tight tabular-nums",
            account.balance < 0
              ? "text-destructive"
              : account.balance === 0
                ? "text-muted-foreground"
                : "text-foreground",
          )}
        >
          {formatCurrency(account.balance)}
        </p>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-md",
              config.iconBg,
            )}
          >
            <Icon className={cn("size-4", config.iconColor)} />
          </div>
          <span className={cn("text-sm font-semibold", config.labelColor)}>
            {config.label}
          </span>
        </div>
      </div>
    </Card>
  );
}
