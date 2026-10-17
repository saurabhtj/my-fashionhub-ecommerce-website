"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { trendingProducts } from "@/lib/data";

export default function TrendingSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeading
          title="Trending Now"
          subtitle="Most loved pieces this week — curated by our community."
        />
        <div className="marquee-container mt-12">
          <div className="animate-marquee gap-6 pr-6">
            {[...trendingProducts, ...trendingProducts].map((product, i) => (
              <div
                key={`${product.id}-${i}`}
                className="w-[280px] md:w-[320px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
