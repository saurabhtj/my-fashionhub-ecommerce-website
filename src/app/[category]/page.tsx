import React from 'react';
import PageLayout from '../../components/PageLayout';
import ProductCard from '../../components/ProductCard';
import { allProducts } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryStr } = await params;

  // Mapping paths to category names in data
  const map: Record<string, string> = {
    'women': 'Women',
    'men': 'Men',
    'kids': 'Kids',
    'accessories': 'Accessories',
    'sale': 'Sale', // Special case
    'new-arrivals': 'New Arrivals'
  };

  const mappedCat = map[categoryStr];
  if (!mappedCat) {
    notFound();
  }

  let products: typeof allProducts = [];
  if (categoryStr === 'sale') {
    products = allProducts.filter(p => p.isSale);
  } else if (categoryStr === 'new-arrivals') {
    products = allProducts.filter(p => p.isNew);
  } else {
    products = allProducts.filter(p => p.category === mappedCat);
  }

  return (
    <PageLayout>
      <section className="relative h-64 md:h-80 bg-neutral-900 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
            {mappedCat}
          </h1>
          <p className="mt-3 text-sm text-neutral-300 tracking-wide">
            Browse our {mappedCat.toLowerCase()} collection
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-center text-neutral-400 py-16">
              No products found in this category.
            </p>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
