"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import { dispatchWishlistUpdated } from "@/lib/cartStorage";
import { hasWishlistProduct } from "@/lib/wishlist";
import { useStoreProduct } from "@/components/ProductCatalogProvider";

interface ProductCardProps {
  product: Product;
}

const subscribeToTouchInput = (callback: () => void) => {
  const media = window.matchMedia("(hover: none)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getTouchInputSnapshot = () => window.matchMedia("(hover: none)").matches;
const getTouchInputServerSnapshot = () => false;

export default function ProductCard({ product }: ProductCardProps) {
  const currentProduct = useStoreProduct(product);
  const [isHovered, setIsHovered] = useState(false);
  const hasTouchInput = useSyncExternalStore(
    subscribeToTouchInput,
    getTouchInputSnapshot,
    getTouchInputServerSnapshot,
  );
  const { status } = useSession();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Just visually setting it to loading during action
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ideally we would fetch wishlist items from an API or a context 
    // to determine if THIS product is in the wishlist
    // For now we'll fetch just for this product if authenticated
    if (status === 'authenticated') {
      fetch('/api/wishlist')
        .then(res => res.json())
        .then(data => {
          setIsWishlisted(hasWishlistProduct(data, currentProduct.id));
        })
        .catch(console.error);
    }
  }, [status, currentProduct.id]);

  const discount = currentProduct.originalPrice
    ? Math.round(
        ((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100
      )
    : null;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      setLoading(true);
      if (isWishlisted) {
        const response = await fetch(`/api/wishlist/${currentProduct.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Could not remove this product from your wishlist.");
        setIsWishlisted(false);
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: currentProduct.id })
        });
        if (!response.ok) throw new Error("Could not add this product to your wishlist.");
        setIsWishlisted(true);
      }
      dispatchWishlistUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentProduct.stock === 0 || currentProduct.isArchived) return;
    if (status === 'unauthenticated') {
      const { addGuestCartItem } = await import('@/lib/cartStorage');
      addGuestCartItem(currentProduct.id, 1, 'M', 'Default');
      alert('Added to cart!');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: currentProduct.id, quantity: 1 })
      });
      if (res.ok) {
        const { dispatchCartUpdated } = await import('@/lib/cartStorage');
        dispatchCartUpdated();
        alert('Added to cart!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (currentProduct.isArchived) return null;

  return (
    <Link href={`/product/${currentProduct.id}`} className="group block">
      <motion.div
        className="relative overflow-hidden bg-neutral-100"
        style={{ aspectRatio: "3/4" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <motion.img
          src={currentProduct.image}
          alt={currentProduct.name}
          className="img-cover"
          animate={{ scale: isHovered ? 1.04 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          loading="lazy"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {currentProduct.isNew && (
            <span className="px-2.5 py-1 bg-neutral-900 text-white text-[9px] font-semibold tracking-[0.15em] uppercase">
              New
            </span>
          )}
          {currentProduct.isSale && discount && (
            <span className="px-2.5 py-1 bg-white text-neutral-900 text-[9px] font-semibold tracking-[0.15em] uppercase">
              -{discount}%
            </span>
          )}
          {currentProduct.tag && !currentProduct.isNew && !currentProduct.isSale && (
            <span className="px-2.5 py-1 bg-neutral-900 text-white text-[9px] font-semibold tracking-[0.15em] uppercase">
              {currentProduct.tag}
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button 
          onClick={handleWishlist}
          disabled={loading}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-neutral-600 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
        >
          <svg 
            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none stroke-current stroke-2'}`} 
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {/* Quick actions – visible on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-3 flex gap-2"
          initial={false}
          animate={{
            opacity: isHovered || hasTouchInput ? 1 : 0,
            y: isHovered || hasTouchInput ? 0 : 8,
          }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={handleAddToCart}
            disabled={loading || currentProduct.stock === 0 || currentProduct.isArchived}
            className="flex-1 py-2.5 bg-black/90 backdrop-blur-sm text-white text-[10px] font-semibold tracking-[0.15em] uppercase hover:bg-black transition-colors"
          >
            {currentProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </motion.div>
      </motion.div>

      {/* Info */}
      <div className="mt-4">
        <p className="text-[11px] text-neutral-400 tracking-[0.12em] uppercase mb-1">
          {currentProduct.category}
        </p>
        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors leading-snug">
          {currentProduct.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-neutral-900">
            ₹{currentProduct.price.toLocaleString('en-IN')}
          </span>
          {currentProduct.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
