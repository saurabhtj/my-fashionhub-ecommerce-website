"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { reviews } from "@/lib/data";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "#171717" : "none"}
          stroke="#171717"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Real stories from people who wear Fashion Hub every day."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="border border-neutral-200 p-8 flex flex-col"
            >
              <Stars count={review.rating} />
              <p className="mt-5 text-sm text-neutral-600 leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover bg-neutral-200"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-neutral-400">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
