import type { Metadata } from "next";
import { getSession } from "@/lib/helpers/getSession";

export const metadata: Metadata = {
  title: "Finio — Personal Finance Tracker",
  description: "Track your spending, budgets, and savings goals in one place.",
};
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

async function Page() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default Page;
