import { Wallet } from "lucide-react";
import { AccountCard, type Account } from "@/components/accounts/account-card";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Wallet className="size-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">No accounts yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first account to start tracking your finances.
          </p>
        </div>
        <CreateAccountDialog />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateAccountDialog />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
