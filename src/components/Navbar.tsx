"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { isWishlistResponse } from "@/lib/wishlist";
import ProductSearchInput from "@/components/ProductSearchInput";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Kids", href: "/kids" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Sale", href: "/sale" },
];

const SECONDARY_LINKS = [
  { label: "Shop All", href: "/shop" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { status } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateCartCount = () => {
      if (status === "authenticated") {
        fetch("/api/cart")
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              const count = data.reduce((acc, item) => acc + item.quantity, 0);
              setCartCount(count);
            }
          })
          .catch(console.error);
      } else {
        try {
          const raw = localStorage.getItem("fashionhub_guest_cart_v1");
          if (!raw) {
            setCartCount(0);
            return;
          }
          const guestItems: unknown = JSON.parse(raw);
          if (!Array.isArray(guestItems)) throw new Error("Guest cart data must be an array.");
          const count = guestItems.reduce<number>((acc, item: unknown) => {
            if (typeof item !== "object" || item === null || Array.isArray(item)) return acc;
            const quantity = (item as { quantity?: unknown }).quantity;
            return acc + (typeof quantity === "number" && Number.isFinite(quantity) ? quantity : 1);
          }, 0);
          setCartCount(count);
          return;
        } catch (error) {
          console.error("Could not read guest cart data:", error);
        }
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cart_updated", updateCartCount);
    return () => window.removeEventListener("cart_updated", updateCartCount);
  }, [status]);

  useEffect(() => {
    const updateWishlistCount = () => {
      if (status !== "authenticated") {
        setWishlistCount(0);
        return;
      }

      fetch("/api/wishlist")
        .then((response) => {
          if (!response.ok) throw new Error("Could not load wishlist count.");
          return response.json() as Promise<unknown>;
        })
        .then((data) => {
          if (!isWishlistResponse(data)) throw new Error("Wishlist response was invalid.");
          setWishlistCount(data.length);
        })
        .catch((error) => console.error("Could not update wishlist count:", error));
    };

    updateWishlistCount();
    window.addEventListener("wishlist_updated", updateWishlistCount);
    return () => window.removeEventListener("wishlist_updated", updateWishlistCount);
  }, [status]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchSelect = (query: string, productId?: string) => {
    router.push(productId ? `/product/${encodeURIComponent(productId)}` : `/shop?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-neutral-200/60 bg-white/80 backdrop-blur-md">
        <nav
          className="mx-auto flex h-16 w-full items-center justify-between lg:h-20"
          style={{ maxWidth: 1440, marginInline: "auto", paddingInline: 21 }}
        >
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex h-11 w-11 flex-col items-center justify-center gap-1.5 -ml-2"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1.5px] bg-neutral-900"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-[1.5px] bg-neutral-900"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1.5px] bg-neutral-900"
            />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="ORUMA home">
            <Image
              src="/oruma-logo.png"
              alt="ORUMA"
              width={75}
              height={59}
              className="h-12 w-auto object-contain md:h-14"
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-[13px] font-medium tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search icon */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors hidden sm:flex items-center justify-center ${
                searchOpen ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {status === "authenticated" ? (
              <>
                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                  className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors hidden sm:block"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <div className="relative group hidden sm:block">
                  <Link
                    href="/profile"
                    aria-label="Account"
                    className="p-2 hover:bg-neutral-100 rounded-full transition-colors block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Link>
                </div>

                <button
                  onClick={() => signOut()}
                  className="text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-black hidden sm:block ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium hover:text-gray-600">
                  Login
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/register" className="text-sm font-medium hover:text-gray-600">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Icon (Always visible) */}
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2874f0] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* ── Glassmorphism Search Dropdown ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div
                style={{
                  borderTop: "1px solid rgba(200,200,200,0.4)",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  padding: "14px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  maxWidth: "100%",
                }}
              >
                <form
                  onSubmit={handleSearchSubmit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flex: 1,
                    maxWidth: "700px",
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.6)",
                    border: "1.5px solid rgba(180,180,180,0.5)",
                    borderRadius: "50px",
                    padding: "0 18px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <ProductSearchInput
                    inputRef={searchInputRef}
                    inputId="navbar-search-input"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSelect={handleSearchSelect}
                    placeholder="Search for products, styles, categories…"
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "14px",
                      color: "#0a0a0a",
                      fontFamily: "Inter, sans-serif",
                      padding: "13px 0",
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      style={{
                        background: "rgba(0,0,0,0.07)",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#666",
                        flexShrink: 0,
                      }}
                      aria-label="Clear"
                    >
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    style={{
                      background: "#0a0a0a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50px",
                      padding: "7px 18px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      flexShrink: 0,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Search
                  </button>
                </form>

                {/* Close */}
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  aria-label="Close search"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                    padding: "6px",
                    borderRadius: "50%",
                    display: "flex",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="region"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-white lg:hidden overflow-y-auto"
          >
            <div className="px-6 pt-8 pb-20 flex flex-col gap-6">
              {/* Mobile search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                    setMobileOpen(false);
                    setSearchQuery("");
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(245,245,245,0.8)",
                  border: "1.5px solid rgba(200,200,200,0.5)",
                  borderRadius: "50px",
                  padding: "0 16px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <ProductSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handleSearchSelect}
                  placeholder="Search products…"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    padding: "12px 0",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </form>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-semibold tracking-tight text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-neutral-200 my-2" />

              {status === "authenticated" ? (
                <>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-base font-medium text-neutral-900">Profile</Link>
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-base font-medium text-neutral-900">Wishlist ({wishlistCount})</Link>
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className="text-base font-medium text-neutral-900">Cart ({cartCount})</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-left text-base font-medium text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-base font-medium text-neutral-900">Login</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="text-base font-medium text-neutral-900">Sign Up</Link>
                </>
              )}

              <div className="h-px bg-neutral-200 my-2" />
              {SECONDARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
