"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm md:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <span
        className={cn(
          "line-accent mt-6",
          align === "center" ? "mx-auto" : ""
        )}
      />
    </div>
  );
}
