"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { newArrivals } from "@/lib/data";

export default function NewArrivalsSection() {
  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-wide">
        <SectionHeading
          title="New Arrivals"
          subtitle="Fresh from the studio — discover the latest additions to our collection."
        />
        <div className="marquee-container mt-12">
          <div className="animate-marquee gap-6 pr-6">
            {[...newArrivals, ...newArrivals].map((product, i) => (
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
