import { getSession } from "@/lib/helpers/getSession";
import { redirect } from "next/navigation";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/");

  return <div>{children}</div>;
}

export default DashboardLayout;
