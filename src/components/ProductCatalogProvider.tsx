"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/data";

type ProductCatalogContextValue = {
  products: Map<string, Product>;
  loaded: boolean;
};

const ProductCatalogContext = createContext<ProductCatalogContextValue>({
  products: new Map(),
  loaded: false,
});

export function ProductCatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products/catalog", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the current product catalog.");
        return response.json() as Promise<{ products: Product[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(new Map(data.products.map((product) => [product.id, product])));
        setLoaded(true);
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error("Product catalog refresh failed:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ products, loaded }), [products, loaded]);
  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useStoreProduct(product: Product): Product {
  const catalog = useContext(ProductCatalogContext);
  const current = catalog.products.get(product.id);
  if (current) return current;
  return catalog.loaded ? { ...product, isArchived: true } : product;
}
