"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  Target,
  Tags,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Accounts", href: "/accounts", icon: Wallet },
  { label: "Budgets", href: "/budgets", icon: PiggyBank },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Categories", href: "/categories", icon: Tags },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      {/* ── Logo ── */}
      <SidebarHeader className="px-5 pt-6 pb-0">
        <Link href="/dashboard" className="group flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand/[0.2] bg-brand/[0.08] transition-all duration-200 group-hover:border-brand/[0.35] group-hover:bg-brand/[0.15]">
            <TrendingUp className="h-[15px] w-[15px] text-brand" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold tracking-[0.3em] text-sidebar-foreground uppercase">
              Finio
            </span>
            <span className="mt-0.5 text-[8px] tracking-[0.2em] text-sidebar-foreground/[0.5] uppercase">
              Finance
            </span>
          </div>
        </Link>

        {/* Brand gradient rule */}
        <div className="mt-5 h-px bg-gradient-to-r from-brand/[0.3] via-brand/[0.1] to-transparent" />
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent className="px-3 pt-5 pb-2">
        <p className="mb-2.5 px-3 text-[8.5px] font-semibold tracking-[0.22em] text-sidebar-foreground/[0.5] uppercase select-none">
          Navigate
        </p>

        <nav className="flex flex-col gap-px">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/[0.6] hover:bg-sidebar-accent/[0.6] hover:text-sidebar-foreground/[0.85]"
                )}
              >
                {/* Left active indicator */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] rounded-full transition-all duration-300",
                    isActive
                      ? "h-5 bg-brand opacity-100 shadow-[0_0_10px_var(--brand-glow)]"
                      : "h-0 opacity-0"
                  )}
                />

                {/* Icon box */}
                <div
                  className={cn(
                    "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border transition-all duration-200",
                    isActive
                      ? "border-brand/[0.2] bg-brand/[0.1] text-brand shadow-[0_0_14px_var(--brand-glow)]"
                      : "border-sidebar-foreground/[0.08] bg-sidebar-foreground/[0.04] text-sidebar-foreground/[0.5] group-hover:border-sidebar-foreground/[0.12] group-hover:bg-sidebar-foreground/[0.07] group-hover:text-sidebar-foreground/[0.7]"
                  )}
                >
                  <Icon className="h-[14px] w-[14px]" />
                </div>

                {/* Label */}
                <span className="text-sm font-medium tracking-wide">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="px-5 py-5">
        <div className="mb-4 h-px bg-gradient-to-r from-sidebar-foreground/[0.08] to-transparent" />
        <div className="flex items-center gap-2">
          <span className="inline-block h-[5px] w-[5px] rounded-full bg-brand/50" />
          <span className="text-[8.5px] tracking-[0.2em] text-sidebar-foreground/[0.5] uppercase select-none">
            Personal Finance
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
