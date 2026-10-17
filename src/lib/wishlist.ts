export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
  };
}

export function isWishlistItem(value: unknown): value is WishlistItem {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  if (
    typeof item.id !== 'string' ||
    typeof item.productId !== 'string' ||
    typeof item.product !== 'object' ||
    item.product === null ||
    Array.isArray(item.product)
  ) return false;

  const product = item.product as Record<string, unknown>;
  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.category === 'string' &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    typeof product.image === 'string'
  );
}

export function isWishlistResponse(value: unknown): value is WishlistItem[] {
  return Array.isArray(value) && value.every(isWishlistItem);
}

export function hasWishlistProduct(value: unknown, productId: string) {
  return isWishlistResponse(value) && value.some((item) => item.productId === productId);
}
