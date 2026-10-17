import { allProducts } from '@/lib/data';

export interface CartItemType {
  id: string;
  productId: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    tag?: string;
    stock?: number;
    description?: string;
  };
  seller?: string;
}

const GUEST_CART_KEY = 'fashionhub_guest_cart_v1';
const SAVED_FOR_LATER_KEY = 'fashionhub_saved_for_later_v1';
const PINCODE_KEY = 'fashionhub_delivery_pincode_v1';

// Broadcast cart changes across tabs and navbar
export function dispatchCartUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
  }
}

export function dispatchWishlistUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wishlist_updated'));
  }
}

// Guest Cart
export function getGuestCart(): CartItemType[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading guest cart:', e);
    return [];
  }
}

export function saveGuestCart(items: CartItemType[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    dispatchCartUpdated();
  } catch (e) {
    console.error('Error saving guest cart:', e);
  }
}

export function addGuestCartItem(productId: string, quantity = 1, size = 'M', color = 'Default'): CartItemType[] {
  const items = getGuestCart();
  const product = allProducts.find(p => p.id === productId);
  if (!product) return items;

  const existingIndex = items.findIndex(
    it => it.productId === productId && (it.size || 'M') === size && (it.color || 'Default') === color
  );

  const originalPrice = product.originalPrice || (product.price < 1000 ? Math.round(product.price * 1.25) : Math.round(product.price * 1.2));

  if (existingIndex > -1) {
    items[existingIndex].quantity = Math.min(items[existingIndex].quantity + quantity, 25);
  } else {
    items.unshift({
      id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      productId,
      size,
      color,
      quantity,
      seller: 'Oruma Fashion Hub',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: originalPrice > product.price ? originalPrice : undefined,
        image: product.image,
        category: product.category,
        tag: product.tag,
        stock: 25,
        description: product.description,
      }
    });
  }

  saveGuestCart(items);
  return items;
}

// Saved For Later
export function getSavedForLater(): CartItemType[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_FOR_LATER_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading saved for later:', e);
    return [];
  }
}

export function saveSavedForLater(items: CartItemType[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVED_FOR_LATER_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving saved for later:', e);
  }
}

// Pincode
export function getSavedPincode(): string {
  if (typeof window === 'undefined') return '680687'; // Default to Oruma Chentrappinni / Kerala pincode
  return localStorage.getItem(PINCODE_KEY) || '680687';
}

export function savePincode(pincode: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PINCODE_KEY, pincode);
}

// Totals calculation
export function calculateCartTotals(items: CartItemType[]) {
  let totalItemsCount = 0;
  let totalSellingPrice = 0;
  let totalOriginalPrice = 0;

  for (const item of items) {
    const qty = item.quantity || 1;
    totalItemsCount += qty;
    const sellPrice = item.product.price;
    const origPrice = item.product.originalPrice || (sellPrice < 1000 ? Math.round(sellPrice * 1.25) : Math.round(sellPrice * 1.2));
    
    totalSellingPrice += sellPrice * qty;
    totalOriginalPrice += origPrice * qty;
  }

  const totalDiscount = Math.max(0, totalOriginalPrice - totalSellingPrice);
  // Free delivery over ₹500
  const isFreeDelivery = totalSellingPrice >= 500 || totalSellingPrice === 0;
  const deliveryCharges = isFreeDelivery ? 0 : 40;
  const grandTotal = totalSellingPrice + (totalSellingPrice > 0 ? deliveryCharges : 0);
  const totalSavings = totalDiscount + (isFreeDelivery && totalSellingPrice > 0 ? 40 : 0);

  return {
    totalItemsCount,
    totalOriginalPrice,
    totalSellingPrice,
    totalDiscount,
    isFreeDelivery,
    deliveryCharges,
    grandTotal,
    totalSavings,
  };
}
