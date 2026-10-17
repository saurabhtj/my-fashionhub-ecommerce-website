"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  Shop: [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Kids", href: "/kids" },
    { label: "Sale", href: "/sale" },
    { label: "All Products", href: "/shop" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Help: [
    { label: "FAQ", href: "#" },
    { label: "Shipping & Returns", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "Track Order", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-wide section-padding">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="ORUMA home" className="inline-flex">
              <Image
                src="/oruma-logo-white.png"
                alt="ORUMA"
                width={110}
                height={87}
                unoptimized
                className="h-[5.5rem] w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-sm">
              Curated fashion designed for the way you move, live and express
              yourself. Premium quality, timeless design.
            </p>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              {["Instagram", "Twitter", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors text-xs font-medium tracking-wider uppercase"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Fashion Hub. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
