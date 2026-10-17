"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BrandStorySection() {
  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src="https://picsum.photos/id/1005/700/875"
              alt="Our story"
              className="img-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
              Crafted with
              <br />
              <span className="font-serif italic font-normal">intention.</span>
            </h2>
            <div className="mt-8 space-y-5 text-neutral-500 leading-relaxed">
              <p>
                Fashion Hub was born from a simple belief: style should be
                effortless, not excessive. We curate pieces that bridge the gap
                between everyday comfort and elevated design.
              </p>
              <p>
                Every fabric is sourced with care. Every silhouette is considered.
                We work with artisans who share our commitment to quality and
                sustainability, because clothing should be made to last.
              </p>
              <p>
                From our studio to your wardrobe, each collection tells a story
                of modern living — minimal, intentional, and unmistakably you.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-8">
              <div className="min-w-0">
                <span className="text-3xl font-bold text-neutral-900">50+</span>
                <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 tracking-wide uppercase">Countries</p>
              </div>
              <div className="min-w-0">
                <span className="text-3xl font-bold text-neutral-900">200K</span>
                <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 tracking-wide uppercase">Customers</p>
              </div>
              <div className="min-w-0">
                <span className="text-3xl font-bold text-neutral-900">98%</span>
                <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 tracking-wide uppercase">Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
