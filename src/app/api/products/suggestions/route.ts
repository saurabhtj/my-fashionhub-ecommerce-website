import { NextResponse } from "next/server";
import { getStoredProductSearchSuggestions } from "@/lib/productSearchService";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length > 120) {
    return NextResponse.json({ error: "Search query must be 120 characters or fewer." }, { status: 400 });
  }

  try {
    return NextResponse.json(await getStoredProductSearchSuggestions(query));
  } catch (error) {
    console.error("Product search suggestions failed:", error);
    return NextResponse.json({ error: "Suggestions are temporarily unavailable." }, { status: 500 });
  }
}
