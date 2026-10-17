'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { Product } from '@/lib/data';
import { dispatchWishlistUpdated } from '@/lib/cartStorage';
import { hasWishlistProduct } from '@/lib/wishlist';

export default function ProductClient({ product }: { product: Product }) {
  const { status } = useSession();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState('');
  
  // Selections
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Default');

  useEffect(() => {
    if (status === 'authenticated' && product) {
      fetch('/api/wishlist')
        .then(res => res.json())
        .then(data => {
          setIsWishlisted(hasWishlistProduct(data, product.id));
        })
        .catch(console.error);
    }
  }, [status, product]);

  const handleWishlist = async () => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      setLoading(true);
      if (isWishlisted) {
        const response = await fetch(`/api/wishlist/${product.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Could not remove this product from your wishlist.');
        setIsWishlisted(false);
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
        if (!response.ok) throw new Error('Could not add this product to your wishlist.');
        setIsWishlisted(true);
      }
      dispatchWishlistUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock === 0 || product.isArchived) {
      setCartError('This item is currently out of stock.');
      return;
    }
    setCartError('');
    if (status === 'unauthenticated') {
      const { addGuestCartItem } = await import('@/lib/cartStorage');
      addGuestCartItem(product.id, 1, selectedSize, selectedColor);
      alert('Added to cart!');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          color: selectedColor,
          quantity: 1
        })
      });

      if (res.ok) {
        const { dispatchCartUpdated } = await import('@/lib/cartStorage');
        dispatchCartUpdated();
        alert('Added to cart!');
      } else {
        const data = await res.json().catch(() => ({}));
        setCartError(data.error || 'Could not add this item to your cart.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-100 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[750px] object-cover object-center transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Details */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.tag && (
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white bg-black px-3 py-1 rounded-full">
                  {product.tag}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl font-bold tracking-tight text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              {product.originalPrice && (
                <p className="text-lg text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Sizes */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-900 font-medium">Size</h3>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {['XS', 'S', 'M', 'L', 'XL', 'Free Size'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border py-3 px-2 text-xs font-semibold uppercase rounded-lg transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0 || product.isArchived}
                className="flex-1 bg-black border border-transparent rounded-lg py-4 px-8 flex items-center justify-center text-sm font-semibold tracking-wider text-white uppercase hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-400"
              >
                {product.stock === 0 || product.isArchived ? 'Out of Stock' : loading ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleWishlist}
                disabled={loading}
                aria-label="Wishlist"
                className={`rounded-lg py-4 px-6 flex items-center justify-center border transition-colors cursor-pointer ${
                  isWishlisted 
                    ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 text-gray-400 hover:bg-gray-50'
                }`}
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
            {cartError && <p role="alert" className="mt-3 text-sm text-red-600">{cartError}</p>}
            
            {/* Description */}
            <div className="mt-10 border-t border-neutral-200 pt-8">
              <h2 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-3">Product Description</h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  {product.description || (
                    "Experience the perfect blend of style and comfort with this premium piece from Fashion Hub. Crafted with meticulous attention to detail, it's designed to elevate your everyday wardrobe. Whether you're dressing up for a special occasion or keeping it casual, this versatile addition offers unparalleled quality and a flattering fit."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
