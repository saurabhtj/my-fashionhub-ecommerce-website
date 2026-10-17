import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminAuthorization() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.trim().toLowerCase();

    if (!email) {
      return { user: null, status: 401 as const, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return { user: null, status: 403 as const, error: "Forbidden" };
    }

    return { user, status: 200 as const, error: null };
  } catch (error) {
    console.error("Admin authorization check failed:", error);
    return { user: null, status: 503 as const, error: "Admin authorization is temporarily unavailable." };
  }
}
