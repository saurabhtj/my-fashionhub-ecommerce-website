"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import ProductSearchInput from "@/components/ProductSearchInput";
import { allProducts, type Product } from "@/lib/data";

const CATEGORIES = ["All", "Women", "Men", "Kids", "Accessories"];

interface SearchApiResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
  correctedQuery: string | null;
  categories: string[];
}

function isSearchApiResponse(value: unknown): value is SearchApiResponse {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Partial<SearchApiResponse>;
  return Array.isArray(data.products) &&
    data.products.every((product) =>
      typeof product === "object" && product !== null &&
      typeof product.id === "string" &&
      typeof product.name === "string" &&
      typeof product.price === "number" &&
      typeof product.image === "string" &&
      typeof product.category === "string"
    ) &&
    typeof data.total === "number" &&
    typeof data.page === "number" &&
    typeof data.size === "number" &&
    (data.correctedQuery === null || typeof data.correctedQuery === "string") &&
    Array.isArray(data.categories) &&
    data.categories.every((category) => typeof category === "string");
}

// Inner component uses useSearchParams — must be inside Suspense
function ShopContent({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [exactSearch, setExactSearch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [remoteSearch, setRemoteSearch] = useState<{
    key: string;
    result?: SearchApiResponse;
    error?: string;
  } | null>(null);

  const requestKey = `${active}\u0000${searchQuery}\u0000${exactSearch}`;

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams({ q: searchQuery, page: "1", size: "50" });
      if (active !== "All") params.set("category", active);
      if (exactSearch) params.set("exact", "true");

      try {
        const response = await fetch(`/api/products/search?${params.toString()}`, {
          signal: controller.signal,
        });
        const body: unknown = await response.json();
        if (!response.ok) {
          const message = typeof body === "object" && body !== null && "error" in body && typeof body.error === "string"
            ? body.error
            : "Product search is temporarily unavailable.";
          throw new Error(message);
        }
        if (!isSearchApiResponse(body)) throw new Error("Product search returned invalid data.");
        setRemoteSearch({ key: requestKey, result: body });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Could not search products:", error);
        setRemoteSearch({
          key: requestKey,
          error: error instanceof Error ? error.message : "Product search is temporarily unavailable.",
        });
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [active, exactSearch, requestKey, searchQuery]);

  const searchResult = remoteSearch?.key === requestKey ? remoteSearch.result : undefined;
  const searchError = remoteSearch?.key === requestKey ? remoteSearch.error : undefined;
  const searchLoading = !searchResult && !searchError;

  const filtered = useMemo(() => {
    const products = searchResult?.products ?? [];
    // Apply sorting
    const sorted = [...products];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [searchResult?.products, sortBy]);

  const handleSearchSelect = (query: string, productId?: string) => {
    if (productId) {
      router.push(`/product/${encodeURIComponent(productId)}`);
      return;
    }
    if (CATEGORIES.includes(query)) {
      setActive(query);
      setSearchQuery("");
      setExactSearch(false);
      return;
    }
    setSearchQuery(query);
    setExactSearch(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setExactSearch(false);
  };

  return (
    <PageLayout>
      {/* Hero banner */}
      <section className="relative h-64 md:h-80 bg-neutral-900 flex items-center justify-center overflow-hidden">
        <img
          src="https://picsum.photos/id/1040/1600/600"
          alt="Shop all"
          className="absolute inset-0 img-cover opacity-35"
        />
        <div className="relative z-10 text-center px-4">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400 mb-2">
            ORUMA FASHION HUB
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            The Fashion Hub Shop
          </h1>
          <p className="mt-3 text-sm text-neutral-300 tracking-wide max-w-lg mx-auto">
            Discover all 46 pieces across our ladieswear, menswear, kidswear, and traditional Kerala collections.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">

          {/* ── Glassmorphism Search Bar ── */}
          <div className="flex justify-center mb-10">
            <div
              className={`glass-search-wrapper${searchFocused ? " focused" : ""}`}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "560px",
                borderRadius: "50px",
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: searchFocused
                  ? "1.5px solid rgba(10,10,10,0.35)"
                  : "1.5px solid rgba(200,200,200,0.5)",
                boxShadow: searchFocused
                  ? "0 8px 32px rgba(0,0,0,0.13), 0 1.5px 8px rgba(0,0,0,0.07)"
                  : "0 4px 20px rgba(0,0,0,0.07)",
                transition: "box-shadow 0.25s ease, border-color 0.25s ease",
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                gap: "10px",
              }}
            >
              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke={searchFocused ? "#0a0a0a" : "#9ca3af"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, transition: "stroke 0.2s" }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <ProductSearchInput
                inputId="shop-search"
                value={searchQuery}
                onChange={handleSearchChange}
                onSelect={handleSearchSelect}
                onFocusChange={setSearchFocused}
                placeholder="Search products, categories…"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "14px",
                  color: "#0a0a0a",
                  fontFamily: "Inter, sans-serif",
                  padding: "14px 0",
                  letterSpacing: "0.01em",
                }}
              />

              {/* Clear button */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => handleSearchChange("")}
                    aria-label="Clear search"
                    style={{
                      background: "rgba(0,0,0,0.08)",
                      border: "none",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                      color: "#555",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Category Filter tabs & Toolbar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {CATEGORIES.map((cat) => {
                const count = cat === "All" ? allProducts.length : allProducts.filter(p => p.category === cat).length;
                const isActive = active === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown & Count */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-neutral-500 font-medium">
                {searchLoading
                  ? "Searching…"
                  : searchError
                    ? "Search unavailable"
                    : `${searchResult?.total ?? 0} ${(searchResult?.total ?? 0) === 1 ? "product" : "products"}`}
              </span>
              <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5">
                <span className="text-xs text-neutral-400 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search result info */}
          {searchError && (
            <p role="alert" className="mb-8 text-center text-sm text-rose-700">{searchError}</p>
          )}

          {searchQuery.trim() && searchResult && (
            searchResult.correctedQuery ? (
              <div className="mb-8 text-center text-sm text-neutral-500">
                <p>
                  Showing results for <strong className="font-semibold text-neutral-800">“{searchResult.correctedQuery}”</strong>
                  {` · ${searchResult.total} result${searchResult.total !== 1 ? "s" : ""}`}
                </p>
                <button
                  type="button"
                  onClick={() => setExactSearch(true)}
                  className="mt-1 underline underline-offset-2 hover:text-neutral-900"
                >
                  Search instead for “{searchQuery}”
                </button>
              </div>
            ) : (
              <p className="mb-8 text-center text-sm text-neutral-500">
                {searchResult.total === 0
                  ? `No results for "${searchQuery}"`
                  : `${searchResult.total} result${searchResult.total !== 1 ? "s" : ""} for "${searchQuery}"`}
              </p>
            )
          )}

          {/* ── Products Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="sync">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {searchResult && filtered.length === 0 && !searchQuery && (
            <p className="text-center text-neutral-400 py-16">
              No products found in this category.
            </p>
          )}
          {searchResult && filtered.length === 0 && searchQuery.trim() && (
            <div className="py-14 text-center">
              <p className="text-lg font-medium text-neutral-800">No exact matches for “{searchQuery}”.</p>
              <p className="mt-2 text-sm text-neutral-500">Try a different product name, category, spelling, or price range.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActive(category);
                    }}
                    className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    Browse {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  return <ShopContent key={initialQuery} initialQuery={initialQuery} />;
}

// Exported page wraps inner component in Suspense for static prerendering support
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
        Loading shop…
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
