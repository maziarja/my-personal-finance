import Link from "next/link";
import {
  Landmark,
  Tags,
  ReceiptText,
  PiggyBank,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { buttonVariants } from "@/lib/variants/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: 1,
    icon: Landmark,
    title: "Add an account",
    description:
      "Track balances across your bank accounts, cash, and credit cards.",
    href: "/accounts",
    primary: true,
    cta: "Start here",
  },
  {
    step: 2,
    icon: Tags,
    title: "Create categories",
    description:
      "Group your spending into labelled categories with custom colors.",
    href: "/categories",
    primary: false,
    cta: "Set up",
  },
  {
    step: 3,
    icon: ReceiptText,
    title: "Log a transaction",
    description:
      "Record income and expenses — your account balances update automatically.",
    href: "/transactions",
    primary: false,
    cta: "Set up",
  },
  {
    step: 4,
    icon: PiggyBank,
    title: "Set a budget",
    description:
      "Put a monthly spending limit on a category and track your progress.",
    href: "/budgets",
    primary: false,
    cta: "Set up",
  },
] as const;

export function DashboardEmpty() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-brand/20 from-brand/[0.06] flex flex-col items-center gap-3 rounded-xl border bg-gradient-to-b to-transparent px-6 py-10 text-center">
        <div className="bg-brand/10 flex size-12 items-center justify-center rounded-full">
          <Sparkles className="text-brand size-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Let&lsquo;s get you started</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Follow these four steps to start tracking your finances.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(
          ({ step, icon: Icon, title, description, href, primary, cta }) => (
            <div
              key={step}
              className={cn(
                "flex flex-col gap-5 rounded-xl border p-5",
                primary ? "border-brand/25 bg-brand/2.5" : "",
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    primary ? "bg-brand/10" : "bg-muted",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      primary ? "text-brand" : "text-muted-foreground",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    primary
                      ? "bg-brand/15 text-brand"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {description}
                </p>
              </div>

              <Link
                href={href}
                className={cn(
                  buttonVariants({
                    variant: primary ? "default" : "outline",
                    size: "sm",
                  }),
                  "mt-auto w-full gap-1.5",
                )}
              >
                {cta}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
