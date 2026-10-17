'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import PageLayout from '../../components/PageLayout';
import DeliveryAddressBar from '../../components/cart/DeliveryAddressBar';
import CartItemCard from '../../components/cart/CartItemCard';
import PriceDetailsCard from '../../components/cart/PriceDetailsCard';
import SavedForLaterSection from '../../components/cart/SavedForLaterSection';
import EmptyCart from '../../components/cart/EmptyCart';
import RemoveConfirmModal from '../../components/cart/RemoveConfirmModal';
import UndoToast from '../../components/cart/UndoToast';

import {
  CartItemType,
  getGuestCart,
  saveGuestCart,
  getSavedForLater,
  saveSavedForLater,
  calculateCartTotals,
  dispatchCartUpdated,
} from '@/lib/cartStorage';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [savedItems, setSavedItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Remove confirmation modal state
  const [itemToRemove, setItemToRemove] = useState<CartItemType | null>(null);

  // Undo removal state
  const [recentlyRemoved, setRecentlyRemoved] = useState<{
    item: CartItemType;
    index: number;
  } | null>(null);

  // Load Saved For Later from localStorage
  useEffect(() => {
    setSavedItems(getSavedForLater());
  }, []);

  // Fetch or sync cart
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      if (status === 'authenticated') {
        // If guest had items in localStorage before login, sync them to backend!
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
          for (const gItem of guestItems) {
            try {
              await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: gItem.productId,
                  quantity: gItem.quantity,
                  size: gItem.size || 'M',
                  color: gItem.color || 'Default',
                }),
              });
            } catch (err) {
              console.error('Error syncing guest item:', err);
            }
          }
          saveGuestCart([]); // Clear guest cart once synced
        }

        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setCartItems(data);
        }
      } else if (status === 'unauthenticated') {
        const local = getGuestCart();
        setCartItems(local);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'loading') {
      loadCart();
    }
  }, [status, loadCart]);

  // Handle Quantity Update
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    if (status === 'authenticated') {
      setActionLoadingId(itemId);
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        });
        if (!res.ok) {
          // Revert if error
          loadCart();
        } else {
          dispatchCartUpdated();
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
        loadCart();
      } finally {
        setActionLoadingId(null);
      }
    } else {
      // Guest mode
      const updated = getGuestCart().map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      saveGuestCart(updated);
    }
  };

  // Confirm Removal & Trigger Undo
  const handleConfirmRemove = async (item: CartItemType) => {
    const itemIndex = cartItems.findIndex((it) => it.id === item.id);
    setItemToRemove(null);

    // Save for undo
    setRecentlyRemoved({ item, index: itemIndex });

    // Optimistic remove
    setCartItems((prev) => prev.filter((it) => it.id !== item.id));

    if (status === 'authenticated') {
      try {
        await fetch(`/api/cart/${item.id}`, { method: 'DELETE' });
        dispatchCartUpdated();
      } catch (err) {
        console.error('Error deleting cart item:', err);
      }
    } else {
      const updated = getGuestCart().filter((it) => it.id !== item.id);
      saveGuestCart(updated);
    }
  };

  // Undo Removal
  const handleUndo = async () => {
    if (!recentlyRemoved) return;
    const { item, index } = recentlyRemoved;
    setRecentlyRemoved(null);

    // Restore locally
    setCartItems((prev) => {
      const copy = [...prev];
      copy.splice(Math.max(0, index), 0, item);
      return copy;
    });

    if (status === 'authenticated') {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size || 'M',
            color: item.color || 'Default',
          }),
        });
        loadCart();
        dispatchCartUpdated();
      } catch (err) {
        console.error('Error restoring cart item:', err);
      }
    } else {
      const guestItems = getGuestCart();
      guestItems.splice(Math.max(0, index), 0, item);
      saveGuestCart(guestItems);
    }
  };

  // Save for Later
  const handleSaveForLater = async (item: CartItemType) => {
    // Add to saved items
    const updatedSaved = [item, ...savedItems.filter((it) => it.id !== item.id)];
    setSavedItems(updatedSaved);
    saveSavedForLater(updatedSaved);

    // Remove from active cart
    setCartItems((prev) => prev.filter((it) => it.id !== item.id));

    if (status === 'authenticated') {
      try {
        await fetch(`/api/cart/${item.id}`, { method: 'DELETE' });
        dispatchCartUpdated();
      } catch (err) {
        console.error('Error saving for later:', err);
      }
    } else {
      const updatedGuest = getGuestCart().filter((it) => it.id !== item.id);
      saveGuestCart(updatedGuest);
    }
  };

  // Move back to Cart from Saved For Later
  const handleMoveToCart = async (item: CartItemType) => {
    // Remove from saved
    const updatedSaved = savedItems.filter((it) => it.id !== item.id);
    setSavedItems(updatedSaved);
    saveSavedForLater(updatedSaved);

    // Add to active cart
    setCartItems((prev) => [item, ...prev]);

    if (status === 'authenticated') {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity || 1,
            size: item.size || 'M',
            color: item.color || 'Default',
          }),
        });
        loadCart();
        dispatchCartUpdated();
      } catch (err) {
        console.error('Error moving to cart:', err);
      }
    } else {
      const guestItems = getGuestCart();
      guestItems.unshift(item);
      saveGuestCart(guestItems);
    }
  };

  // Remove permanently from Saved For Later
  const handleRemoveSavedItem = (item: CartItemType) => {
    const updatedSaved = savedItems.filter((it) => it.id !== item.id);
    setSavedItems(updatedSaved);
    saveSavedForLater(updatedSaved);
  };

  // Place Order flow
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent('/checkout'));
    } else {
      router.push('/checkout');
    }
  };

  // Calculate live totals
  const totals = useMemo(() => calculateCartTotals(cartItems), [cartItems]);

  return (
    <PageLayout>
      <div className="bg-[#f1f3f6] min-h-[calc(100vh-80px)] py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-600">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 && savedItems.length === 0 ? (
            <div className="max-w-2xl mx-auto pt-6 pb-12">
              <EmptyCart />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start pb-20 sm:pb-8">
              
              {/* ── Left Column: Cart Items & Saved for Later ── */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Delivery Address Banner */}
                <DeliveryAddressBar />

                {/* Main Cart Items Container */}
                <div className="bg-white rounded-sm border border-gray-200/90 shadow-2xs overflow-hidden">
                  {/* Cart Header */}
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-200/80 flex items-center justify-between bg-white">
                    <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                      My Cart ({cartItems.length})
                    </h1>
                    {cartItems.length > 0 && (
                      <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                        Items are reserved for 30 minutes
                      </span>
                    )}
                  </div>

                  {/* Empty active cart notification if saved items exist */}
                  {cartItems.length === 0 ? (
                    <div className="p-8 text-center bg-white">
                      <p className="text-gray-600 font-medium">There are no items in your active cart.</p>
                      <Link
                        href="/shop"
                        className="inline-block mt-3 text-xs font-semibold text-[#2874f0] uppercase tracking-wider hover:underline"
                      >
                        Explore Products
                      </Link>
                    </div>
                  ) : (
                    /* Cart Item Cards List */
                    <div>
                      {cartItems.map((item) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          loading={actionLoadingId === item.id}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRequestRemove={(it) => setItemToRemove(it)}
                          onSaveForLater={handleSaveForLater}
                        />
                      ))}
                    </div>
                  )}

                  {/* Desktop Bottom Action Bar */}
                  {cartItems.length > 0 && (
                    <div className="hidden sm:flex justify-end items-center px-6 py-4 bg-white border-t border-gray-200/80 shadow-2xs sticky bottom-0 z-20">
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        className="bg-[#fb641b] hover:bg-[#e85d18] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider px-14 py-3.5 rounded-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>PLACE ORDER</span>
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
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Saved For Later Section */}
                <SavedForLaterSection
                  savedItems={savedItems}
                  onMoveToCart={handleMoveToCart}
                  onRemoveSavedItem={handleRemoveSavedItem}
                />
              </div>

              {/* ── Right Column: Price Details Sidebar ── */}
              {cartItems.length > 0 && (
                <div className="lg:col-span-4 lg:sticky lg:top-24">
                  <PriceDetailsCard
                    totalItemsCount={totals.totalItemsCount}
                    totalOriginalPrice={totals.totalOriginalPrice}
                    totalSellingPrice={totals.totalSellingPrice}
                    totalDiscount={totals.totalDiscount}
                    deliveryCharges={totals.deliveryCharges}
                    isFreeDelivery={totals.isFreeDelivery}
                    grandTotal={totals.grandTotal}
                    totalSavings={totals.totalSavings}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Mobile Sticky Bottom Bar (Flipkart Style) ── */}
          {cartItems.length > 0 && (
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3 shadow-xl">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{totals.grandTotal.toLocaleString('en-IN')}
                  </span>
                  {totals.totalSavings > 0 && (
                    <span className="text-[10px] font-semibold text-[#388e3c]">
                      Save ₹{totals.totalSavings.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="shrink-0 bg-[#fb641b] hover:bg-[#e85d18] active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-4 sm:px-8 py-3 rounded-xs shadow-md transition-all cursor-pointer"
              >
                PLACE ORDER
              </button>
            </div>
          )}

          {/* Remove Item Confirmation Modal */}
          <RemoveConfirmModal
            item={itemToRemove}
            onCancel={() => setItemToRemove(null)}
            onConfirm={handleConfirmRemove}
          />

          {/* Undo Removal Notification Toast */}
          <UndoToast
            removedItem={recentlyRemoved ? recentlyRemoved.item : null}
            onUndo={handleUndo}
            onDismiss={() => setRecentlyRemoved(null)}
          />

        </div>
      </div>
    </PageLayout>
  );
}
