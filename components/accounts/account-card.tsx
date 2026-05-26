"use client";

import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EditAccountDialog } from "@/components/accounts/edit-account-dialog";
import { DeleteAccountDialog } from "@/components/accounts/delete-account-dialog";

export interface Account {
  id: string;
  name: string;
  type: "CHECKING" | "SAVING" | "CREDIT_CARD" | "CASH";
  balance: number;
}

const TYPE_LABELS: Record<Account["type"], string> = {
  CHECKING: "Checking",
  SAVING: "Saving",
  CREDIT_CARD: "Credit Card",
  CASH: "Cash",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardAction>
          <div className="flex items-center gap-1">
            <EditAccountDialog account={account} />
            <DeleteAccountDialog accountId={account.id} accountName={account.name} />
          </div>
        </CardAction>
        <span className="w-fit rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {TYPE_LABELS[account.type]}
        </span>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-2xl font-semibold tabular-nums",
            account.balance < 0
              ? "text-destructive"
              : account.balance === 0
                ? "text-muted-foreground"
                : "text-foreground"
          )}
        >
          {formatCurrency(account.balance)}
        </p>
      </CardContent>
    </Card>
  );
}
