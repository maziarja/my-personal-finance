"use client";

import { Wallet } from "lucide-react";
import { AccountCard } from "@/components/accounts/account-card";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/app/_actions/accountActions";

export function AccountList() {
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
  console.log(accounts);
  if (accounts?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <Wallet className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="font-medium">No accounts yet</p>
          <p className="text-muted-foreground text-sm">
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
      <div className="grid grid-cols-1 gap-4">
        {accounts?.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
