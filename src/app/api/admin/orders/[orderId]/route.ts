import { NextResponse } from "next/server";
import { getAdminAuthorization } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const ALLOWED_DELIVERY_STATUSES = new Set(["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const authorization = await getAdminAuthorization();
  if (!authorization.user) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const { orderId } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("deliveryStatus" in body) ||
    typeof body.deliveryStatus !== "string" ||
    !ALLOWED_DELIVERY_STATUSES.has(body.deliveryStatus)
  ) {
    return NextResponse.json({ error: "Unsupported fulfilment status." }, { status: 400 });
  }

  try {
    const result = await prisma.order.updateMany({
      where: { id: orderId },
      data: { deliveryStatus: body.deliveryStatus },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, deliveryStatus: body.deliveryStatus });
  } catch (error) {
    console.error("Admin order status update failed:", error);
    return NextResponse.json({ error: "Could not update fulfilment status." }, { status: 500 });
  }
}
