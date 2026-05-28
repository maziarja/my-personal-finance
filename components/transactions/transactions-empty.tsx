import { ReceiptText } from "lucide-react";
import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog";

export function TransactionsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="bg-muted flex size-12 items-center justify-center rounded-full">
        <ReceiptText className="text-muted-foreground size-6" />
      </div>
      <div>
        <p className="font-medium">No transactions yet</p>
        <p className="text-muted-foreground text-sm">
          Log your first transaction to start tracking income and expenses.
        </p>
      </div>
      <CreateTransactionDialog accounts={[]} categories={[]} />
    </div>
  );
}
