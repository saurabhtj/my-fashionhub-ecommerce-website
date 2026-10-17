import { NextResponse } from "next/server";
import { getAdminAuthorization } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await getAdminAuthorization();
  if (!authorization.user) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  try {
    const [totalOrders, successfulPayments, pendingPayments, capturedSales] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: { in: ["PAID", "PARTIALLY_REFUNDED", "REFUNDED"] } } }),
      prisma.order.count({ where: { paymentStatus: { in: ["PENDING", "UNPAID"] } } }),
      prisma.order.aggregate({
        where: { paymentStatus: { in: ["PAID", "PARTIALLY_REFUNDED", "REFUNDED"] } },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      successfulPayments,
      pendingPayments,
      capturedSales: capturedSales._sum.amount ?? 0,
    });
  } catch (error) {
    console.error("Admin overview query failed:", error);
    return NextResponse.json({ error: "Could not load dashboard totals." }, { status: 500 });
  }
}
