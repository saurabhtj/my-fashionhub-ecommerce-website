'use client';

import React, { useEffect } from 'react';
import { CartItemType } from '@/lib/cartStorage';

interface Props {
  item: CartItemType | null;
  onCancel: () => void;
  onConfirm: (item: CartItemType) => void;
}

export default function RemoveConfirmModal({
  item,
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onCancel]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="remove-item-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-fadeIn"
    >
      <div className="bg-white rounded-sm shadow-xl max-w-md w-full p-6 border border-gray-200">
        <h3 id="remove-item-title" className="text-base font-semibold text-gray-900">
          Remove Item
        </h3>
        
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Are you sure you want to remove <strong className="text-gray-900 font-medium">"{item.product.name}"</strong> from your cart?
        </p>

        <div className="mt-6 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-700 hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => onConfirm(item)}
            className="px-6 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-[#2874f0] hover:bg-blue-600 rounded-xs shadow-sm transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
