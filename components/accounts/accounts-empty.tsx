import { Wallet } from "lucide-react";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";

export function AccountsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-brand/8 border border-brand/15 flex size-12 items-center justify-center rounded-full">
        <Wallet className="text-brand size-5" />
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
