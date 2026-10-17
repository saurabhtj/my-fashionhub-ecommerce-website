"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";

export default function CollectionsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Men's Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative group overflow-hidden bg-neutral-100"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="https://picsum.photos/id/1074/800/1000"
              alt="Men's collection"
              className="img-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-2">
                Collection
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                Men
              </h3>
              <Link href="/men">
                <Button variant="secondary" size="md" className="border-white text-white hover:bg-white hover:text-neutral-900">
                  Explore
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Women's Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative group overflow-hidden bg-neutral-100"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="https://picsum.photos/id/1038/800/1000"
              alt="Women's collection"
              className="img-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-2">
                Collection
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                Women
              </h3>
              <Link href="/women">
                <Button variant="secondary" size="md" className="border-white text-white hover:bg-white hover:text-neutral-900">
                  Explore
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
