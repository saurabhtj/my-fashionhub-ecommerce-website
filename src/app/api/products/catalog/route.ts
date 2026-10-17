import { NextResponse } from "next/server";
import { getPublicCatalogProducts } from "@/lib/productSearchService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getPublicCatalogProducts();
    return NextResponse.json({ products }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Public product catalog query failed:", error);
    return NextResponse.json({ error: "Product catalog is temporarily unavailable." }, { status: 500 });
  }
}
