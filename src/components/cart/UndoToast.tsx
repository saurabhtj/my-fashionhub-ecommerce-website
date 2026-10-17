'use client';

import React from 'react';
import { CartItemType } from '@/lib/cartStorage';

interface Props {
  removedItem: CartItemType | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export default function UndoToast({
  removedItem,
  onUndo,
  onDismiss,
}: Props) {
  if (!removedItem) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white px-5 py-3 rounded-sm shadow-xl flex items-center gap-4 text-sm max-w-lg w-[90%] sm:w-auto border border-neutral-700"
    >
      <span className="truncate max-w-[240px] sm:max-w-xs text-neutral-200">
        Removed "{removedItem.product.name}"
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 text-xs transition-colors shrink-0 cursor-pointer"
      >
        UNDO
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-neutral-400 hover:text-white shrink-0 ml-1"
      >
        ✕
      </button>
    </div>
  );
}
