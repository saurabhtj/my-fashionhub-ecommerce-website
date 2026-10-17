import React from 'react';
import { notFound } from 'next/navigation';
import { allProducts } from '@/lib/data';
import ProductClient from './ProductClient';

interface Props {
  params: Promise<{ id: string }>;
}

type StoredProduct = {
  id: string;
  name: string;
  description: string | null;
  tag: string | null;
  price: number;
  category: string;
  image: string;
  stock: number;
  isArchived: boolean;
};

async function getStoredProduct(id: string): Promise<StoredProduct | null> {
  const apiOrigin = process.env.API_PROXY_ORIGIN;
  if (!apiOrigin) {
    const { prisma } = await import('@/lib/prisma');
    return prisma.product.findUnique({ where: { id } });
  }

  const response = await fetch(new URL('/api/products/catalog', apiOrigin), {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Could not load the product catalog from the API service.');
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('products' in payload) ||
    !Array.isArray(payload.products)
  ) {
    throw new Error('The product catalog API returned an invalid response.');
  }

  const product = payload.products.find(
    (entry): entry is StoredProduct =>
      typeof entry === 'object' &&
      entry !== null &&
      'id' in entry &&
      entry.id === id &&
      'name' in entry &&
      typeof entry.name === 'string' &&
      'price' in entry &&
      typeof entry.price === 'number' &&
      'category' in entry &&
      typeof entry.category === 'string' &&
      'image' in entry &&
      typeof entry.image === 'string' &&
      'stock' in entry &&
      typeof entry.stock === 'number' &&
      'isArchived' in entry &&
      typeof entry.isArchived === 'boolean' &&
      'description' in entry &&
      (typeof entry.description === 'string' || entry.description === null) &&
      'tag' in entry &&
      (typeof entry.tag === 'string' || entry.tag === null),
  );

  return product ?? null;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const storedProduct = await getStoredProduct(id);
  const catalogProduct = allProducts.find((product) => product.id === id);

  if (!storedProduct || storedProduct.isArchived) {
    notFound();
  }

  const product = {
    ...catalogProduct,
    id: storedProduct.id,
    name: storedProduct.name,
    description: storedProduct.description ?? catalogProduct?.description,
    tag: storedProduct.tag ?? catalogProduct?.tag,
    price: storedProduct.price,
    originalPrice: !catalogProduct || storedProduct.price === catalogProduct.price ? catalogProduct?.originalPrice : undefined,
    isSale: !catalogProduct || storedProduct.price === catalogProduct.price ? catalogProduct?.isSale : false,
    category: storedProduct.category,
    image: storedProduct.image,
    stock: storedProduct.stock,
    isArchived: storedProduct.isArchived,
  };

  return <ProductClient product={product} />;
}
