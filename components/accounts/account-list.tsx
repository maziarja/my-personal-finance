"use client";

import { AccountCard } from "@/components/accounts/account-card";
import { AccountsEmpty } from "@/components/accounts/accounts-empty";
import { AccountsError } from "@/components/accounts/accounts-error";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";
import { getCardSpan } from "@/lib/helpers/get-card-span";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/app/_actions/accountActions";
import { accountKey } from "@/lib/query-keys/accounts";
import { AccountListSkeleton } from "@/components/accounts/account-list-skeleton";

export function AccountList() {
  const {
    data: accounts,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: accountKey.list(),
    queryFn: getAccounts,
  });

  if (isPending) return <AccountListSkeleton />;

  if (isError || (accounts && "error" in accounts)) {
    return <AccountsError onRetry={refetch} />;
  }

  if (accounts?.length === 0) {
    return <AccountsEmpty />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateAccountDialog />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts?.map((account, index) => (
          <div
            key={account.id}
            className={getCardSpan(index, accounts.length)}
          >
            <AccountCard account={account} />
          </div>
        ))}
      </div>
    </div>
  );
}
