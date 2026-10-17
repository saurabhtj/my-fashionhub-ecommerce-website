"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium tracking-widest uppercase transition-all duration-300 ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950",
    secondary:
      "bg-white text-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-white active:bg-neutral-800",
    outline:
      "bg-transparent text-neutral-900 border border-neutral-300 hover:border-neutral-900 active:bg-neutral-50",
    ghost:
      "bg-transparent text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200",
  };

  const sizes = {
    sm: "text-[10px] px-5 py-2.5 tracking-[0.15em]",
    md: "text-[11px] px-7 py-3.5 tracking-[0.18em]",
    lg: "text-xs px-10 py-4.5 tracking-[0.2em]",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
