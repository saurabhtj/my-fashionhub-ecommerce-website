"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/lib/data";

const TABS = ["All", "Women", "Men", "Kids", "Accessories"];

export default function ShopSection() {
  const [activeTab, setActiveTab] = useState("All");

  const displayedProducts = useMemo(() => {
    let list = activeTab === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeTab);
    return list.slice(0, 8);
  }, [activeTab]);

  return (
    <section className="section-padding bg-neutral-50/80 border-t border-neutral-200/60" id="shop">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-500 mb-2">
              ORUMA STORE CATALOG
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              Explore Our Shop
            </h2>
            <p className="mt-2 text-sm text-neutral-500 max-w-xl">
              Authentic Kerala silks, traditional Kasavu drapes, modern casuals & festive partywear directly from our three dedicated floors in Chentrappinni.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-900 hover:text-neutral-600 transition-colors pb-1 border-b-2 border-neutral-900"
          >
            <span>View Full Shop ({allProducts.length})</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-start">
          {TABS.map((tab) => {
            const count = tab === "All" ? allProducts.length : allProducts.filter(p => p.category === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100/50"
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Bar */}
        <div className="mt-14 pt-10 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-2xs">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Can't find what you're looking for?
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Browse our complete catalog of {allProducts.length} items with instant search and filters.
            </p>
          </div>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-widest rounded-lg shadow-sm text-center transition-colors shrink-0"
          >
            Go to Shop Page ({allProducts.length} Products)
          </Link>
        </div>
      </div>
    </section>
  );
}
