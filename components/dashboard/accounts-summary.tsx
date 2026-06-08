import { AccountCard, type Account } from "@/components/accounts/account-card";

type AccountsSummaryProps = {
  accounts: Account[];
};

export function AccountsSummary({ accounts }: AccountsSummaryProps) {
  if (accounts.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed py-10">
        <p className="text-muted-foreground text-sm">No accounts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}
