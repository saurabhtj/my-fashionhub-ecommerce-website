import { prisma } from "@/lib/prisma";
import { allProducts, type Product } from "@/lib/data";
import {
  getSearchCandidateTerms,
  getProductSearchSuggestions,
  searchProducts,
  type ProductSearchFilters,
  type ProductSearchSuggestion,
} from "@/lib/productSearch";

export const STOREFRONT_PRODUCT_CATEGORIES = [...new Set(allProducts.map((product) => product.category))];
const STOREFRONT_PRODUCT_IDS = new Set(allProducts.map((product) => product.id));
const LEGACY_SEED_PRODUCT_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

async function loadStoredCandidates(products: Product[]) {
  if (products.length === 0) return [];

  const records = await prisma.product.findMany({
    where: { id: { in: products.map((product) => product.id) }, isArchived: false },
    select: {
      id: true,
      name: true,
      description: true,
      tag: true,
      price: true,
      category: true,
      image: true,
      stock: true,
      isArchived: true,
    },
  });
  return records.map((record) => {
    const catalogProduct = products.find((product) => product.id === record.id);
    const priceUnchanged = !catalogProduct || record.price === catalogProduct.price;
    return {
      ...(catalogProduct ?? { id: record.id, isNew: false, isSale: false }),
      id: record.id,
      name: record.name,
      description: record.description ?? catalogProduct?.description,
      tag: record.tag ?? catalogProduct?.tag,
      price: record.price,
      originalPrice: priceUnchanged ? catalogProduct?.originalPrice : undefined,
      isSale: priceUnchanged && catalogProduct?.isSale === true,
      category: record.category,
      image: record.image,
      stock: record.stock,
      isArchived: record.isArchived,
    };
  });
}

async function loadNewStoredCandidates(query: string, exact: boolean) {
  const terms = getSearchCandidateTerms(query, exact);
  const where = {
    isArchived: false,
    id: { notIn: [...LEGACY_SEED_PRODUCT_IDS] },
    ...(terms.length > 0 ? {
      OR: terms.flatMap((term) => [
        { name: { contains: term } },
        { category: { contains: term } },
        { description: { contains: term } },
        { tag: { contains: term } },
        { id: { contains: term } },
      ]),
    } : {}),
  };
  const records = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 250,
    select: {
      id: true,
      name: true,
      description: true,
      tag: true,
      price: true,
      category: true,
      image: true,
      stock: true,
      isArchived: true,
    },
  });

  return records
    .filter((record) => !STOREFRONT_PRODUCT_IDS.has(record.id))
    .map((record) => ({
      id: record.id,
      name: record.name,
      description: record.description ?? undefined,
      tag: record.tag ?? undefined,
      price: record.price,
      category: record.category,
      image: record.image,
      stock: record.stock,
      isArchived: record.isArchived,
    }));
}

export async function searchStoredProducts(query: string, filters: ProductSearchFilters = {}) {
  const candidates = searchProducts(query, {
    ...filters,
    minPrice: 0,
    maxPrice: Number.MAX_SAFE_INTEGER,
    exact: false,
  }).products;
  const [storedCandidates, newStoredCandidates] = await Promise.all([
    loadStoredCandidates(candidates),
    loadNewStoredCandidates(query, filters.exact === true),
  ]);
  const productsById = new Map([...storedCandidates, ...newStoredCandidates].map((product) => [product.id, product]));
  return searchProducts(query, filters, [...productsById.values()]);
}

export async function getStoredProductSearchSuggestions(query: string): Promise<ProductSearchSuggestion> {
  const products = await searchStoredProducts(query);
  return getProductSearchSuggestions(query, products.products);
}

export async function getPublicCatalogProducts() {
  const records = await prisma.product.findMany({
    where: { isArchived: false, id: { notIn: [...LEGACY_SEED_PRODUCT_IDS] } },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      tag: true,
      price: true,
      category: true,
      image: true,
      stock: true,
      isArchived: true,
    },
  });
  const staticById = new Map(allProducts.map((product) => [product.id, product]));

  return records.map((record) => {
    const product = staticById.get(record.id);
    const priceUnchanged = !product || record.price === product.price;
    return {
      ...product,
      id: record.id,
      name: record.name,
      description: record.description ?? product?.description,
      tag: record.tag ?? product?.tag,
      price: record.price,
      originalPrice: priceUnchanged ? product?.originalPrice : undefined,
      isSale: priceUnchanged && product?.isSale === true,
      category: record.category,
      image: record.image,
      stock: record.stock,
      isArchived: record.isArchived,
    };
  });
}
