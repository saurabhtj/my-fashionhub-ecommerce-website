"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </>
  );
}
