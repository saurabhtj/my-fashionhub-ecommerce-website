'use client';

import React from 'react';
import Link from 'next/link';
import { CartItemType } from '@/lib/cartStorage';
import QuantitySelector from './QuantitySelector';

interface Props {
  item: CartItemType;
  loading?: boolean;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRequestRemove: (item: CartItemType) => void;
  onSaveForLater: (item: CartItemType) => void;
}

export default function CartItemCard({
  item,
  loading = false,
  onUpdateQuantity,
  onRequestRemove,
  onSaveForLater,
}: Props) {
  const { product } = item;
  const originalPrice = product.originalPrice || (product.price < 1000 ? Math.round(product.price * 1.25) : Math.round(product.price * 1.2));
  const hasDiscount = originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  // Delivery date estimate (2 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="p-4 sm:p-6 bg-white transition-colors border-b border-gray-200/80 last:border-b-0">
      <div className="flex gap-4 sm:gap-6">
        {/* Left: Product Image */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <Link
            href={`/product/${product.id}`}
            className="w-24 h-28 sm:w-28 sm:h-32 bg-gray-50 rounded-xs overflow-hidden border border-gray-100 flex items-center justify-center p-1 group"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>

          {/* Quantity Selector on Mobile */}
          <div className="sm:hidden mt-1">
            <QuantitySelector
              quantity={item.quantity}
              max={product.stock || 25}
              loading={loading}
              onUpdate={(newQty) => onUpdateQuantity(item.id, newQty)}
            />
          </div>
        </div>

        {/* Right: Info and Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${product.id}`}
                className="text-[15px] sm:text-[16px] font-medium text-gray-900 hover:text-[#2874f0] line-clamp-2 transition-colors leading-snug"
              >
                {product.name}
              </Link>

              {/* Attributes line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                <span>Size: <strong className="text-gray-700 font-semibold">{item.size || 'M'}</strong></span>
                <span className="text-gray-300">•</span>
                <span>Color: <strong className="text-gray-700 font-semibold">{item.color || 'Default'}</strong></span>
                <span className="text-gray-300">•</span>
                <span>Seller: <strong className="text-gray-700">{item.seller || 'Oruma Fashion Hub'}</strong></span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="text-xs text-gray-600 sm:text-right mt-1 sm:mt-0 shrink-0">
              <p>Delivery by <strong className="text-gray-900">{formattedDelivery}</strong></p>
              <p className="text-green-700 font-medium">
                Free Delivery <span className="line-through text-gray-400 font-normal">₹40</span>
              </p>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline flex-wrap gap-2.5 mt-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {hasDiscount && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}

            {hasDiscount && discountPercent > 0 && (
              <span className="text-xs sm:text-sm font-semibold text-[#388e3c]">
                {discountPercent}% Off
              </span>
            )}

            {product.tag && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs ml-1">
                {product.tag}
              </span>
            )}
          </div>

          {/* Stock status indicator */}
          <div className="mt-1.5 text-xs">
            {(product.stock || 25) <= 5 ? (
              <span className="text-red-600 font-medium">
                Only {product.stock} left in stock - order soon
              </span>
            ) : (
              <span className="text-green-700 font-medium">
                ✓ In Stock
              </span>
            )}
          </div>

          {/* Bottom Actions Row (Desktop) */}
          <div className="mt-4 pt-3 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-gray-100">
            {/* Quantity Selector on Desktop */}
            <div className="hidden sm:block">
              <QuantitySelector
                quantity={item.quantity}
                max={product.stock || 25}
                loading={loading}
                onUpdate={(newQty) => onUpdateQuantity(item.id, newQty)}
              />
            </div>

            <button
              type="button"
              onClick={() => onSaveForLater(item)}
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-800 hover:text-[#2874f0] transition-colors cursor-pointer py-1"
            >
              SAVE FOR LATER
            </button>

            <button
              type="button"
              onClick={() => onRequestRemove(item)}
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-800 hover:text-red-600 transition-colors cursor-pointer py-1"
            >
              REMOVE
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
