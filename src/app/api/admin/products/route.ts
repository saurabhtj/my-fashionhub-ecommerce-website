import { NextResponse } from "next/server";
import { getAdminAuthorization } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const CATEGORIES = new Set(["Women", "Men", "Kids", "Accessories"]);

function validateProduct(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const tag = typeof body.tag === "string" ? body.tag.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const price = typeof body.price === "number" ? body.price : Number.NaN;
  const stock = typeof body.stock === "number" ? body.stock : Number.NaN;

  if (image.startsWith("/") && !image.startsWith("//")) {
  } else {
    try {
      const imageUrl = new URL(image);
      if (!["http:", "https:"].includes(imageUrl.protocol)) return null;
    } catch {
      return null;
    }
  }

  if (
    name.length < 2 ||
    name.length > 160 ||
    description.length > 3000 ||
    tag.length > 40 ||
    !CATEGORIES.has(category) ||
    image.length < 1 ||
    image.length > 2048 ||
    !Number.isFinite(price) ||
    price <= 0 ||
    price > 10_000_000 ||
    Math.round(price * 100) !== price * 100 ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    stock > 1_000_000
  ) {
    return null;
  }

  return {
    name,
    description: description || null,
    tag: tag || null,
    category,
    image,
    price,
    stock,
  };
}

export async function GET(request: Request) {
  const authorization = await getAdminAuthorization();
  if (!authorization.user) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const params = new URL(request.url).searchParams;
  const page = Number(params.get("page") ?? "1");
  const size = Number(params.get("size") ?? "20");
  const search = (params.get("q") ?? "").trim();
  const archived = params.get("archived") === "true";
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1 || size > 50 || search.length > 120) {
    return NextResponse.json({ error: "Invalid page, size, or search query." }, { status: 400 });
  }

  const where = {
    isArchived: archived,
    ...(search ? {
      OR: [
        { id: { contains: search } },
        { name: { contains: search } },
        { category: { contains: search } },
      ],
    } : {}),
  };

  try {
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * size,
        take: size,
        select: {
          id: true,
          name: true,
          description: true,
          tag: true,
          price: true,
          category: true,
          image: true,
          stock: true,
          isArchived: true,
          updatedAt: true,
        },
      }),
    ]);
    return NextResponse.json({ products, total, page, size, pages: Math.ceil(total / size) });
  } catch (error) {
    console.error("Admin product list query failed:", error);
    return NextResponse.json({ error: "Could not load products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authorization = await getAdminAuthorization();
  if (!authorization.user) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const data = validateProduct(body);
  if (!data) return NextResponse.json({ error: "Invalid product details." }, { status: 400 });

  try {
    const product = await prisma.product.create({ data });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Admin product creation failed:", error);
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }
}
