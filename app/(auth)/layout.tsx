import { getSession } from "@/lib/helpers/getSession";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) redirect("/");
  return (
    <main className="bg-muted/40 flex min-h-svh items-center justify-center px-4 py-12">
      {children}
    </main>
  );
}
