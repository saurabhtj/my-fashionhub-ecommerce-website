import { NextResponse } from "next/server";
import { getAdminAuthorization } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const CATEGORIES = new Set(["Women", "Men", "Kids", "Accessories"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const authorization = await getAdminAuthorization();
  if (!authorization.user) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const { productId } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid product details." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const data: Record<string, string | number | boolean | null> = {};
  if (input.price !== undefined) {
    const price = typeof input.price === "number" ? input.price : Number.NaN;
    if (!Number.isFinite(price) || price <= 0 || price > 10_000_000 || Math.round(price * 100) !== price * 100) {
      return NextResponse.json({ error: "Price must be a positive amount with at most two decimals." }, { status: 400 });
    }
    data.price = price;
  }
  if (input.stock !== undefined) {
    if (typeof input.stock !== "number" || !Number.isInteger(input.stock) || input.stock < 0 || input.stock > 1_000_000) {
      return NextResponse.json({ error: "Stock must be a whole number between 0 and 1,000,000." }, { status: 400 });
    }
    data.stock = input.stock;
  }
  if (input.isArchived !== undefined) {
    if (typeof input.isArchived !== "boolean") {
      return NextResponse.json({ error: "Archive state must be true or false." }, { status: 400 });
    }
    data.isArchived = input.isArchived;
  }
  if (input.name !== undefined) {
    if (typeof input.name !== "string" || input.name.trim().length < 2 || input.name.trim().length > 160) {
      return NextResponse.json({ error: "Product name must be between 2 and 160 characters." }, { status: 400 });
    }
    data.name = input.name.trim();
  }
  if (input.description !== undefined) {
    if (typeof input.description !== "string" || input.description.length > 3000) {
      return NextResponse.json({ error: "Description must be 3,000 characters or fewer." }, { status: 400 });
    }
    data.description = input.description.trim();
  }
  if (input.tag !== undefined) {
    if (typeof input.tag !== "string" || input.tag.length > 40) {
      return NextResponse.json({ error: "Tag must be 40 characters or fewer." }, { status: 400 });
    }
    data.tag = input.tag.trim();
  }
  if (input.category !== undefined) {
    if (typeof input.category !== "string" || !CATEGORIES.has(input.category)) {
      return NextResponse.json({ error: "Unsupported product category." }, { status: 400 });
    }
    data.category = input.category;
  }
  if (input.image !== undefined) {
    if (typeof input.image !== "string" || input.image.trim().length < 1 || input.image.trim().length > 2048) {
      return NextResponse.json({ error: "Image URL is invalid." }, { status: 400 });
    }
    const image = input.image.trim();
    if (!image.startsWith("/") || image.startsWith("//")) {
      try {
        const url = new URL(image);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported image protocol");
      } catch {
        return NextResponse.json({ error: "Image URL must use HTTP or HTTPS." }, { status: 400 });
      }
    }
    data.image = image;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No product changes were provided." }, { status: 400 });
  }

  try {
    const result = await prisma.product.updateMany({ where: { id: productId }, data });
    if (result.count === 0) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    const product = await prisma.product.findUnique({ where: { id: productId } });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin product update failed:", error);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
  }
}
