"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";

export default function PromoSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Limited Time
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              End of Season
              <br />
              <span className="font-serif italic font-normal text-neutral-300">Sale</span>
            </h2>
            <p className="mt-6 text-neutral-400 leading-relaxed max-w-md">
              Up to 40% off on selected styles. Elevate your wardrobe with
              premium pieces at exceptional prices.
            </p>
            <div className="mt-8">
              <Link href="/sale">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-neutral-900"
                >
                  Shop Sale
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="https://picsum.photos/id/1021/700/875"
              alt="End of season sale"
              className="img-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
