"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="section-padding bg-neutral-900 text-white">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-4">
            Stay Connected
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Join the Community
          </h2>
          <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
            Subscribe for early access to new collections, exclusive offers,
            and styling inspiration — delivered weekly.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 transition-colors"
              />
              <Button
                type="submit"
                variant="secondary"
                className="border-white text-white hover:bg-white hover:text-neutral-900 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-sm text-neutral-300"
            >
              Thank you for subscribing. Welcome to Fashion Hub.
            </motion.p>
          )}

          <p className="mt-4 text-[11px] text-neutral-600">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
