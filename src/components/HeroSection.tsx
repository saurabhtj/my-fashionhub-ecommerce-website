"use client";

import React, { useState, useEffect, useSyncExternalStore, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), {
  ssr: false,
});

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => true);
}

function useIsMobile() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function HeroSection() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const show3D = reducedMotion === false && isMobile === false;

  const fadeUp = reducedMotion === false
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      }
    : {};

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-neutral-50">
      {/* 3D Canvas or fallback */}
      {show3D ? (
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      ) : (
        /* Static fallback – subtle geometric pattern */
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/6 w-32 h-32 border border-neutral-200 rotate-45 opacity-40" />
          <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border border-neutral-300 rotate-12 opacity-30" />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 border border-neutral-100 rounded-full opacity-30" />
        </div>
      )}

      {/* Content */}
      <div className="container-wide relative z-10 pt-24 pb-16 md:pt-0">
        <div className="max-w-2xl">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase text-neutral-500 mb-6"
          >
            SS 2025 Collection
          </motion.p>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-neutral-900 leading-[0.95]"
          >
            DEFINE
            <br />
            YOUR
            <br />
            <span className="font-serif italic font-normal">STYLE.</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 text-base md:text-lg text-neutral-500 leading-relaxed max-w-md"
          >
            Discover fashion designed for the way you move, live and express
            yourself.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/men">
              <Button variant="primary" size="lg">
                Shop Men
              </Button>
            </Link>
            <Link href="/women">
              <Button variant="secondary" size="lg">
                Shop Women
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-neutral-300"
        />
      </motion.div>
    </section>
  );
}
