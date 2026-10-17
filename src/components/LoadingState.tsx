"use client";

import React from "react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      {/* Minimal spinner */}
      <div className="w-8 h-8 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      <p className="text-sm text-neutral-500 tracking-wide">{message}</p>
    </div>
  );
}
