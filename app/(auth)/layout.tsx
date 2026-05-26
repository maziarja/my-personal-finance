import { getSession } from "@/lib/helpers/getSession";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-12">
        {children}
      </main>
    </div>
  );
}
