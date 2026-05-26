import { getSession } from "@/lib/helpers/getSession";
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
