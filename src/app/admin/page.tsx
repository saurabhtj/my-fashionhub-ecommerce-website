import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();
  const adminName = session?.user?.name ?? "Administrator";
  const role = (session?.user as { role?: unknown } | undefined)?.role;
  if (!email) redirect("/login?callbackUrl=%2Fadmin");
  if (role !== "ADMIN") redirect("/");

  return <AdminDashboard adminName={adminName} />;
}
