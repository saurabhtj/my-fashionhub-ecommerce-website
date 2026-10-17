'use client';

import React from 'react';
import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="bg-white rounded-sm border border-gray-200/90 shadow-2xs py-14 px-6 text-center">
      {/* Clean Flipkart-style SVG graphic */}
      <div className="w-40 h-40 mx-auto flex items-center justify-center bg-blue-50/60 rounded-full mb-6 border border-blue-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2874f0"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
          <circle cx="12" cy="15" r="1" fill="#2874f0" />
        </svg>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
        Your cart is empty!
      </h2>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
        Explore our curated collection of bridal wear, kurtis, menswear, and party collections from Oruma Fashion Hub.
      </p>

      <div className="mt-7">
        <Link
          href="/shop"
          className="inline-block bg-[#2874f0] hover:bg-blue-600 text-white font-semibold text-sm px-10 py-3 rounded-xs uppercase tracking-wider shadow-sm hover:shadow transition-all"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
