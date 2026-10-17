import { NextResponse } from "next/server";
import { getAdminAuthorization } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const authorization = await getAdminAuthorization();
  if (!authorization.user) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const params = new URL(request.url).searchParams;
  const page = Number(params.get("page") ?? "1");
  const size = Number(params.get("size") ?? "20");
  const search = (params.get("q") ?? "").trim();

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1 || size > 50 || search.length > 120) {
    return NextResponse.json({ error: "Invalid page, size, or search query." }, { status: 400 });
  }

  const where = search ? { id: { contains: search } } : {};

  try {
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * size,
        take: size,
        select: {
          id: true,
          amount: true,
          currency: true,
          paymentStatus: true,
          paymentMethod: true,
          paymentId: true,
          razorpayOrderId: true,
          paymentSignatureVerified: true,
          deliveryStatus: true,
          createdAt: true,
          customerName: true,
          customerPhone: true,
          customerEmail: true,
          user: { select: { name: true, email: true, phone: true } },
          items: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              unitPrice: true,
              size: true,
              color: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ orders, total, page, size, pages: Math.ceil(total / size) });
  } catch (error) {
    console.error("Admin order list query failed:", error);
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}
