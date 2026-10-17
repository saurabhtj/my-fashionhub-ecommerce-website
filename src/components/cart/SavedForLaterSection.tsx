'use client';

import React from 'react';
import Link from 'next/link';
import { CartItemType } from '@/lib/cartStorage';

interface Props {
  savedItems: CartItemType[];
  onMoveToCart: (item: CartItemType) => void;
  onRemoveSavedItem: (item: CartItemType) => void;
}

export default function SavedForLaterSection({
  savedItems,
  onMoveToCart,
  onRemoveSavedItem,
}: Props) {
  if (!savedItems || savedItems.length === 0) return null;

  return (
    <section aria-label="Saved for Later Items" className="mt-6 bg-white rounded-sm border border-gray-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200/80 bg-white">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Saved For Later ({savedItems.length})
        </h2>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200/80">
        {savedItems.map((item) => {
          const { product } = item;
          const originalPrice = product.originalPrice || (product.price < 1000 ? Math.round(product.price * 1.25) : Math.round(product.price * 1.2));
          const hasDiscount = originalPrice > product.price;
          const discountPercent = hasDiscount
            ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
            : 0;

          return (
            <article key={item.id} className="p-4 sm:p-6 bg-white">
              <div className="flex gap-4 sm:gap-6">
                {/* Image */}
                <Link
                  href={`/product/${product.id}`}
                  className="w-20 h-24 sm:w-24 sm:h-28 bg-gray-50 rounded-xs overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center p-1 group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${product.id}`}
                    className="text-sm sm:text-base font-medium text-gray-900 hover:text-[#2874f0] line-clamp-2 transition-colors leading-snug"
                  >
                    {product.name}
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mt-1">
                    <span>Size: <strong className="text-gray-700 font-semibold">{item.size || 'M'}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-gray-700 font-semibold">{item.color || 'Default'}</strong></span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline flex-wrap gap-2 mt-2">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {hasDiscount && discountPercent > 0 && (
                      <span className="text-xs font-semibold text-[#388e3c]">
                        {discountPercent}% Off
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                    <button
                      type="button"
                      onClick={() => onMoveToCart(item)}
                      className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#2874f0] hover:text-blue-700 transition-colors cursor-pointer py-1"
                    >
                      MOVE TO CART
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveSavedItem(item)}
                      className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-red-600 transition-colors cursor-pointer py-1"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
