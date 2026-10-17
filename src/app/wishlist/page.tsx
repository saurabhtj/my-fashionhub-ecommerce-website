'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dispatchWishlistUpdated } from '@/lib/cartStorage';
import { isWishlistResponse, type WishlistItem } from '@/lib/wishlist';

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/wishlist');
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    setError('');
    try {
      const res = await fetch('/api/wishlist');
      if (!res.ok) throw new Error('Could not load your wishlist.');
      const data: unknown = await res.json();
      if (!isWishlistResponse(data)) throw new Error('The wishlist response was invalid.');
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError(error instanceof Error ? error.message : 'Could not load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status]);

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        dispatchWishlistUpdated();
        fetchWishlist();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        alert('Added to cart!');
        removeItem(productId);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">My Wishlist ({wishlistItems.length})</h1>
      {error && <p role="alert" className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {!error && wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love to your wishlist to easily find them later.</p>
          <Link href="/shop" className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
            Discover Products
          </Link>
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group relative border rounded-lg p-4 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="w-full min-h-[300px] bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:h-[300px] lg:aspect-none relative">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-500 hover:text-red-700 hover:bg-white"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
              <div className="mt-4 flex flex-col flex-grow">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/product/${item.productId}`}>
                      {item.product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">₹{item.product.price.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => addToCart(item.productId)}
                    className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
