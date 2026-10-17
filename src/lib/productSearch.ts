import { allProducts, type Product } from "@/lib/data";

export interface ProductSearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  exact?: boolean;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  correctedQuery?: string;
}

export interface ProductSearchSuggestion {
  products: Product[];
  categories: string[];
  popularSearches: string[];
}

const SYNONYM_GROUPS = [
  ["saree", "sari"],
  ["kurti", "kurta"],
  ["gown", "dress", "maxi"],
  ["churidar", "salwar"],
  ["abaya", "pardha"],
  ["shawl", "scarf", "maftha"],
  ["denim", "jeans"],
  ["cotton", "breathable", "lightweight"],
  ["casual", "everyday", "daily"],
  ["traditional", "ethnic", "festive"],
  ["mens", "men"],
  ["womens", "women"],
  ["kids", "children", "child"],
  ["accessory", "accessories"],
];

const SYNONYMS = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
  for (const term of group) {
    SYNONYMS.set(term, group.filter((candidate) => candidate !== term));
  }
}

const STOP_WORDS = new Set([
  "a", "an", "and", "apparel", "are", "affordable", "budget", "cheap", "clothes",
  "clothing", "fashion", "for", "find", "get", "give", "i", "in", "is", "it",
  "looking", "me", "need", "of", "on", "or", "outfit", "please", "show",
  "something", "the", "to", "want", "wear", "with", "you",
]);

const PRICE_PHRASES = [
  /\bbetween\s+₹?\s*(\d[\d,]*)\s+(?:and|to)\s+₹?\s*(\d[\d,]*)\b/i,
  /\b(?:under|below|less than|up to|upto|max(?:imum)?)\s+₹?\s*(\d[\d,]*)\b/i,
  /\b(?:over|above|more than|at least|min(?:imum)?)\s+₹?\s*(\d[\d,]*)\b/i,
];

const CATEGORY_ALIASES: Record<string, string> = {
  women: "Women",
  womens: "Women",
  woman: "Women",
  men: "Men",
  mens: "Men",
  man: "Men",
  kids: "Kids",
  kid: "Kids",
  children: "Kids",
  child: "Kids",
  accessories: "Accessories",
  accessory: "Accessories",
};

const POPULAR_SEARCHES = ["Saree", "Kurti", "Shirt", "Kids"];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const words = (value: string) => normalize(value).split(/\s+/).filter(Boolean);

function editDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const above = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[right.length];
}

function tokenizePriceFilters(query: string): { query: string; minPrice?: number; maxPrice?: number } {
  let remaining = query;
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  for (const [index, pattern] of PRICE_PHRASES.entries()) {
    const match = remaining.match(pattern);
    if (!match) continue;
    const first = Number(match[1].replace(/,/g, ""));
    if (index === 0) {
      const second = Number(match[2].replace(/,/g, ""));
      minPrice = Math.min(first, second);
      maxPrice = Math.max(first, second);
    } else if (index === 1) {
      maxPrice = first;
    } else {
      minPrice = first;
    }
    remaining = remaining.replace(pattern, " ");
    break;
  }

  return { query: remaining, minPrice, maxPrice };
}

function parseQuery(query: string, filters: ProductSearchFilters, catalog: Product[]) {
  const price = tokenizePriceFilters(query);
  const queryWords = words(price.query);
  const categories = [...new Set(catalog.map((product) => product.category))];
  const categoryWord = queryWords.find((word) => CATEGORY_ALIASES[word]);
  const inferredCategory = categoryWord ? CATEGORY_ALIASES[categoryWord] : undefined;
  const category = filters.category ?? inferredCategory;
  const ignoredCategoryWords = new Set(
    Object.keys(CATEGORY_ALIASES).filter((word) => CATEGORY_ALIASES[word] === inferredCategory),
  );
  const terms = queryWords.filter((word) => !STOP_WORDS.has(word) && !ignoredCategoryWords.has(word));

  return {
    terms: terms.slice(0, 18),
    category: category && categories.includes(category) ? category : filters.category,
    minPrice: filters.minPrice ?? price.minPrice,
    maxPrice: filters.maxPrice ?? price.maxPrice,
    normalizedQuery: normalize(price.query),
  };
}

function getTermAlternatives(term: string): string[] {
  return [term, ...(SYNONYMS.get(term) ?? [])];
}

export function getSearchCandidateTerms(query: string, exact = false): string[] {
  const queryWithoutPrice = tokenizePriceFilters(query).query;
  const candidates = words(queryWithoutPrice)
    .filter((word) => !STOP_WORDS.has(word));
  return [...new Set(candidates.flatMap((term) => exact ? [term] : getTermAlternatives(term)))];
}

function productText(product: Product) {
  return {
    name: normalize(product.name),
    category: normalize(product.category),
    tag: normalize(product.tag ?? ""),
    description: normalize(product.description ?? ""),
    id: normalize(product.id),
  };
}

function scoreProduct(product: Product, terms: string[], normalizedQuery: string, exact: boolean): number | null {
  if (terms.length === 0) return 1;
  const text = productText(product);
  const allText = `${text.name} ${text.category} ${text.tag} ${text.description} ${text.id}`;
  const titleWords = new Set(words(text.name));
  const descriptionWords = new Set(words(`${text.description} ${text.tag}`));
  const idWords = new Set(words(text.id));
  const indexedWords = words(allText);
  let score = normalizedQuery.length >= 3 && text.name.includes(normalizedQuery) ? 80 : 0;

  for (const term of terms) {
    const alternatives = exact ? [term] : getTermAlternatives(term);
    let best = 0;
    for (const candidate of alternatives) {
      const synonymWeight = candidate === term ? 1 : 0.72;
      if (titleWords.has(candidate)) best = Math.max(best, 16 * synonymWeight);
      if (text.category === candidate || text.category.includes(candidate)) {
        best = Math.max(best, 13 * synonymWeight);
      }
      if (descriptionWords.has(candidate)) {
        best = Math.max(best, 6 * synonymWeight);
      }
      if (idWords.has(candidate)) best = Math.max(best, 20 * synonymWeight);
      if (!exact && candidate.length >= 3 && best === 0) {
        if (indexedWords.some((indexedWord) => indexedWord.startsWith(candidate))) {
          best = Math.max(best, (titleWords.has(candidate) ? 10 : 4) * synonymWeight);
        }
      }

      if (!exact && best === 0 && candidate.length >= 4 && !/\d/.test(candidate)) {
        const threshold = candidate.length <= 5 ? 1 : 2;
        for (const indexedWord of indexedWords) {
          if (Math.abs(indexedWord.length - candidate.length) > threshold) continue;
          const distance = editDistance(candidate, indexedWord);
          if (distance > 0 && distance <= threshold) {
            const fuzzyScore = (candidate.length <= 5 ? 4 : 5) * synonymWeight;
            best = Math.max(best, fuzzyScore);
          }
        }
      }
    }
    if (best === 0) return null;
    score += best;
  }

  return score + (product.stock && product.stock > 0 ? 0.25 : 0);
}

function suggestCorrectedQuery(query: string, terms: string[], products: Product[], catalog: Product[]) {
  if (products.length === 0) return undefined;
  const frequencies = new Map<string, { names: number; total: number }>();
  for (const product of catalog) {
    for (const word of words(product.name)) {
      const frequency = frequencies.get(word) ?? { names: 0, total: 0 };
      frequency.names += 1;
      frequency.total += 1;
      frequencies.set(word, frequency);
    }
    for (const word of words(`${product.category} ${product.tag ?? ""} ${product.description ?? ""}`)) {
      const frequency = frequencies.get(word) ?? { names: 0, total: 0 };
      frequency.total += 1;
      frequencies.set(word, frequency);
    }
  }
  const sourceWords = words(tokenizePriceFilters(query).query);
  let changed = false;
  const correctedWords = sourceWords.map((word) => {
    if (!terms.includes(word) || frequencies.has(word) || SYNONYMS.has(word) || /\d/.test(word) || word.length < 4) {
      return word;
    }
    const threshold = word.length <= 5 ? 1 : 2;
    let bestDistance = threshold + 1;
    let bestCandidates: string[] = [];
    for (const candidate of frequencies.keys()) {
      if (Math.abs(candidate.length - word.length) > threshold) continue;
      const distance = editDistance(word, candidate);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestCandidates = [candidate];
      } else if (distance === bestDistance) {
        bestCandidates.push(candidate);
      }
    }
    const rankedCandidates = bestCandidates
      .map((candidate) => ({
        candidate,
        frequency: frequencies.get(candidate)!,
      }))
      .sort((left, right) =>
        right.frequency.names - left.frequency.names ||
        right.frequency.total - left.frequency.total
      );
    const best = rankedCandidates[0];
    const runnerUp = rankedCandidates[1];
    const unambiguous = best && (!runnerUp ||
      best.frequency.names > runnerUp.frequency.names ||
      (best.frequency.names === runnerUp.frequency.names && best.frequency.total > runnerUp.frequency.total));
    if (bestDistance <= threshold && unambiguous) {
      changed = true;
      return best.candidate;
    }
    return word;
  });

  if (!changed) return undefined;
  const corrected = correctedWords.join(" ");
  return normalize(corrected) !== normalize(query) ? corrected : undefined;
}

export function searchProducts(
  query: string,
  filters: ProductSearchFilters = {},
  catalog: Product[] = allProducts,
): ProductSearchResult {
  const parsed = parseQuery(query, filters, catalog);
  const matches = catalog
    .filter((product) => {
      if (parsed.category && product.category !== parsed.category) return false;
      if (parsed.minPrice !== undefined && product.price < parsed.minPrice) return false;
      if (parsed.maxPrice !== undefined && product.price > parsed.maxPrice) return false;
      return true;
    })
    .map((product) => ({
      product,
      score: scoreProduct(product, parsed.terms, parsed.normalizedQuery, filters.exact === true),
    }))
    .filter((match): match is { product: Product; score: number } => match.score !== null)
    .sort((left, right) => right.score - left.score || left.product.name.localeCompare(right.product.name));
  const products = matches.map((match) => match.product);

  return {
    products,
    total: products.length,
    correctedQuery: filters.exact
      ? undefined
      : suggestCorrectedQuery(query, parsed.terms, products, catalog),
  };
}

export function getProductSearchSuggestions(
  query: string,
  catalog: Product[] = allProducts,
): ProductSearchSuggestion {
  const trimmed = query.trim();
  if (!trimmed) {
    const popularSearches = POPULAR_SEARCHES.filter((search) => searchProducts(search, {}, catalog).total > 0);
    return { products: [], categories: [], popularSearches };
  }

  const results = searchProducts(trimmed, {}, catalog);
  const matchingCategories = [...new Set(catalog.map((product) => product.category))]
    .filter((category) => normalize(category).includes(normalize(trimmed)))
    .slice(0, 3);

  return {
    products: results.products.slice(0, 5),
    categories: matchingCategories.length
      ? matchingCategories
      : [...new Set(results.products.map((product) => product.category))].slice(0, 3),
    popularSearches: [],
  };
}
