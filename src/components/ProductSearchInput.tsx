"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { CSSProperties, ChangeEvent, KeyboardEvent, Ref } from "react";
import Image from "next/image";
import type { Product } from "@/lib/data";

interface SuggestionsResponse {
  products: Product[];
  categories: string[];
  popularSearches: string[];
}

interface ProductSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string, productId?: string) => void;
  placeholder: string;
  className?: string;
  style?: CSSProperties;
  inputRef?: Ref<HTMLInputElement>;
  inputId?: string;
  onFocusChange?: (focused: boolean) => void;
}

type Option =
  | { kind: "product"; label: string; product: Product }
  | { kind: "category" | "popular"; label: string };

export default function ProductSearchInput({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  style,
  inputRef,
  inputId,
  onFocusChange,
}: ProductSearchInputProps) {
  const generatedId = useId().replace(/:/g, "");
  const listId = `product-search-suggestions-${generatedId}`;
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionsResponse>({
    products: [],
    categories: [],
    popularSearches: [],
  });
  const [suggestionsQuery, setSuggestionsQuery] = useState<string | null>(null);
  const [errorQuery, setErrorQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const options = useMemo<Option[]>(() => {
    if (suggestionsQuery !== value.trim()) return [];
    return [
      ...suggestions.products.map((product) => ({ kind: "product" as const, label: product.name, product })),
      ...suggestions.categories.map((label) => ({ kind: "category" as const, label })),
      ...suggestions.popularSearches.map((label) => ({ kind: "popular" as const, label })),
    ];
  }, [suggestions, suggestionsQuery, value]);

  useEffect(() => {
    if (!focused) return;
    const query = value.trim();
    if (query.length === 1) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/suggestions?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Could not load search suggestions.");
        const data = await response.json() as Partial<SuggestionsResponse>;
        const isProduct = (product: unknown): product is Product =>
          typeof product === "object" && product !== null &&
          "id" in product && typeof product.id === "string" &&
          "name" in product && typeof product.name === "string" &&
          "price" in product && typeof product.price === "number" &&
          "image" in product && typeof product.image === "string" &&
          "category" in product && typeof product.category === "string";
        if (
          !Array.isArray(data.products) || !data.products.every(isProduct) ||
          !Array.isArray(data.categories) || !data.categories.every((item) => typeof item === "string") ||
          !Array.isArray(data.popularSearches) || !data.popularSearches.every((item) => typeof item === "string")
        ) {
          throw new Error("The search suggestions response was invalid.");
        }
        setSuggestions({
          products: data.products,
          categories: data.categories,
          popularSearches: data.popularSearches,
        });
        setSuggestionsQuery(query);
        setErrorQuery(null);
      } catch (caught) {
        if (controller.signal.aborted) return;
        console.error("Could not load product search suggestions:", caught);
        setErrorQuery(query);
        setSuggestionsQuery(query);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [focused, value]);

  const choose = (option: Option) => {
    if (option.kind === "product") {
      onSelect(option.label, option.product.id);
    } else {
      onSelect(option.label);
    }
    setFocused(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && options.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp" && options.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? options.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0 && options[activeIndex]) {
      event.preventDefault();
      choose(options[activeIndex]);
    } else if (event.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    }
  };

  const error = errorQuery === value.trim()
    ? "Suggestions are temporarily unavailable. Submit your search to continue."
    : "";
  const showSuggestions = focused && (options.length > 0 || loading || Boolean(error));

  return (
    <div className="relative min-w-0 flex-1">
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={listId}
        aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
        autoComplete="off"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          setFocused(true);
          onFocusChange?.(true);
        }}
        onBlur={() => window.setTimeout(() => {
          setFocused(false);
          onFocusChange?.(false);
        }, 120)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        style={style}
      />
      {showSuggestions && (
        <div
          id={listId}
          role="listbox"
          aria-label="Product search suggestions"
          className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-80 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 text-left shadow-xl"
        >
          {loading && <p className="px-3 py-2 text-xs text-neutral-500">Finding products…</p>}
          {error && <p className="px-3 py-2 text-xs text-amber-700">{error}</p>}
          {options.map((option, index) => (
            <button
              key={`${option.kind}-${option.kind === "product" ? option.product.id : option.label}`}
              id={`${listId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(option)}
              className={`flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-50 ${
                activeIndex === index ? "bg-neutral-50" : ""
              }`}
            >
              {option.kind === "product" ? (
                <>
                  <Image
                    src={option.product.image}
                    alt=""
                    width={40}
                    height={44}
                    unoptimized
                    className="h-11 w-10 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-neutral-900">{option.label}</span>
                    <span className="block text-xs text-neutral-500">{option.product.category} · ₹{option.product.price.toLocaleString("en-IN")}</span>
                  </span>
                </>
              ) : (
                <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">
                  <span className="mr-2 text-xs uppercase tracking-wide text-neutral-400">
                    {option.kind === "popular" ? "Popular" : "Category"}
                  </span>
                  {option.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
