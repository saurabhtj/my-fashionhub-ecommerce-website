'use client';

import React from 'react';

interface Props {
  quantity: number;
  max?: number;
  loading?: boolean;
  onUpdate: (newQuantity: number) => void;
  className?: string;
}

export default function QuantitySelector({
  quantity,
  max = 25,
  loading = false,
  onUpdate,
  className = '',
}: Props) {
  const isMin = quantity <= 1;
  const isMax = quantity >= max;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Minus Button */}
      <button
        type="button"
        disabled={isMin || loading}
        onClick={() => onUpdate(quantity - 1)}
        aria-label="Decrease quantity"
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-2xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Quantity value box */}
      <div
        className="min-w-[42px] px-2 py-0.5 border border-gray-200 bg-white rounded-xs text-center text-sm font-semibold text-gray-900 select-none shadow-2xs"
        aria-live="polite"
      >
        {quantity}
      </div>

      {/* Plus Button */}
      <button
        type="button"
        disabled={isMax || loading}
        onClick={() => onUpdate(quantity + 1)}
        aria-label="Increase quantity"
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-2xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {isMax && (
        <span className="text-[11px] text-amber-700 font-medium ml-1">
          Max limit ({max})
        </span>
      )}
    </div>
  );
}
