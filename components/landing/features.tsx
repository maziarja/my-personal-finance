import { LayoutList, PiggyBank, Target, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: LayoutList,
    title: "Transactions",
    description:
      "Log every expense and income in one place. Categorize, filter, and search across all your financial activity.",
  },
  {
    icon: PiggyBank,
    title: "Budgets",
    description:
      "Set monthly spending limits by category and get a clear view of where your money is going before it's gone.",
  },
  {
    icon: Target,
    title: "Goals",
    description:
      "Define savings targets — a holiday, an emergency fund, a home — and track your progress milestone by milestone.",
  },
  {
    icon: CreditCard,
    title: "Accounts",
    description:
      "Organize all your bank accounts, credit cards, and wallets in a single unified overview.",
  },
];

export function Features() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Everything you need
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Built around the four pillars of personal finance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="gap-3 py-5">
              <CardHeader className="pb-0">
                <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                  <Icon className="size-4 text-foreground" aria-hidden="true" />
                </div>
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[0.8125rem] leading-relaxed">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
