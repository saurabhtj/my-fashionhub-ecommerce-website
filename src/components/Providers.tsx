"use client";

import { SessionProvider } from "next-auth/react";
import { ProductCatalogProvider } from "@/components/ProductCatalogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProductCatalogProvider>{children}</ProductCatalogProvider>
    </SessionProvider>
  );
}
