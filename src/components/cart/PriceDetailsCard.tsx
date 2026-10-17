'use client';

import React from 'react';

interface Props {
  totalItemsCount: number;
  totalOriginalPrice: number;
  totalSellingPrice: number;
  totalDiscount: number;
  deliveryCharges: number;
  isFreeDelivery: boolean;
  grandTotal: number;
  totalSavings: number;
}

export default function PriceDetailsCard({
  totalItemsCount,
  totalOriginalPrice,
  totalSellingPrice,
  totalDiscount,
  deliveryCharges,
  isFreeDelivery,
  grandTotal,
  totalSavings,
}: Props) {
  return (
    <aside aria-label="Price Details Summary" className="space-y-4">
      {/* Main Price Card */}
      <div className="bg-white rounded-sm border border-gray-200/90 shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-200/80">
          <h2 className="text-xs font-bold tracking-[0.12em] uppercase text-gray-500">
            PRICE DETAILS
          </h2>
        </div>

        {/* Card Body */}
        <div className="px-6 py-4 space-y-4 text-sm text-gray-800">
          {/* Price of items */}
          <div className="flex items-center justify-between">
            <span>Price ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
            <span className="font-medium text-gray-900">
              ₹{totalOriginalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Discount */}
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="font-medium text-[#388e3c]">
              − ₹{totalDiscount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Delivery Charges */}
          <div className="flex items-center justify-between">
            <span>Delivery Charges</span>
            {isFreeDelivery ? (
              <span className="font-medium text-[#388e3c]">
                <span className="line-through text-gray-400 font-normal mr-1.5">₹40</span>
                FREE
              </span>
            ) : (
              <span className="font-medium text-gray-900">
                ₹{deliveryCharges.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Packaging Fee */}
          <div className="flex items-center justify-between">
            <span>Secured Packaging Fee</span>
            <span className="font-medium text-[#388e3c]">
              <span className="line-through text-gray-400 font-normal mr-1.5">₹29</span>
              FREE
            </span>
          </div>

          {/* Total Amount Divider & Row */}
          <div className="border-t border-dashed border-gray-300 pt-4 flex items-center justify-between font-bold text-base sm:text-lg text-gray-900">
            <span>Total Amount</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          {/* Total Savings Highlight */}
          {totalSavings > 0 && (
            <div className="border-t border-gray-100 pt-3 text-xs sm:text-sm font-semibold text-[#388e3c] flex items-center gap-1.5 bg-green-50/70 -mx-6 px-6 py-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>You will save ₹{totalSavings.toLocaleString('en-IN')} on this order</span>
            </div>
          )}
        </div>
      </div>

      {/* Trust & Safe Payment Badge */}
      <div className="p-4 bg-gray-50/80 rounded-sm border border-gray-200/60 flex items-center gap-3 text-xs text-gray-600">
        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#2874f0]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            Safe and Secure Payments.
          </p>
          <p className="text-gray-500 mt-0.5">
            Easy returns. 100% Authentic products directly from Oruma Fashion Hub.
          </p>
        </div>
      </div>
    </aside>
  );
}
