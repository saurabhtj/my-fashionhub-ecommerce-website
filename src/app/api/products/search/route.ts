import { NextResponse } from "next/server";
import {
  searchStoredProducts,
  STOREFRONT_PRODUCT_CATEGORIES,
} from "@/lib/productSearchService";

function parseNonNegativeNumber(value: string | null) {
  if (value === null) return undefined;
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  if (query.length > 120) {
    return NextResponse.json({ error: "Search query must be 120 characters or fewer." }, { status: 400 });
  }

  const page = Number(params.get("page") ?? "1");
  const size = Number(params.get("size") ?? "20");
  const minPrice = parseNonNegativeNumber(params.get("minPrice"));
  const maxPrice = parseNonNegativeNumber(params.get("maxPrice"));
  const category = params.get("category") ?? undefined;
  const sort = params.get("sort") ?? "relevance";
  const exactParam = params.get("exact");

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1 || size > 50) {
    return NextResponse.json({ error: "Invalid page or size. Size must be between 1 and 50." }, { status: 400 });
  }
  if (minPrice === null || maxPrice === null) {
    return NextResponse.json({ error: "Invalid price or category filter." }, { status: 400 });
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return NextResponse.json({ error: "Minimum price cannot exceed maximum price." }, { status: 400 });
  }
  if (category && !STOREFRONT_PRODUCT_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category filter." }, { status: 400 });
  }
  if (!["relevance", "price-asc", "price-desc", "name"].includes(sort)) {
    return NextResponse.json({ error: "Unsupported sort option." }, { status: 400 });
  }
  if (exactParam !== null && exactParam !== "true" && exactParam !== "false") {
    return NextResponse.json({ error: "Exact search must be true or false." }, { status: 400 });
  }

  try {
    const result = await searchStoredProducts(query, {
      category,
      minPrice,
      maxPrice,
      exact: exactParam === "true",
    });
    const products = [...result.products];
    if (sort === "price-asc") products.sort((left, right) => left.price - right.price);
    if (sort === "price-desc") products.sort((left, right) => right.price - left.price);
    if (sort === "name") products.sort((left, right) => left.name.localeCompare(right.name));
    const start = (page - 1) * size;
    return NextResponse.json({
      products: products.slice(start, start + size),
      total: result.total,
      page,
      size,
      correctedQuery: result.correctedQuery ?? null,
      categories: STOREFRONT_PRODUCT_CATEGORIES,
    });
  } catch (error) {
    console.error("Product search failed:", error);
    return NextResponse.json({ error: "Product search is temporarily unavailable." }, { status: 500 });
  }
}
