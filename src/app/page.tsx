"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import ShopSection from "@/components/sections/ShopSection";
import NewArrivalsSection from "@/components/sections/NewArrivalsSection";
import TrendingSection from "@/components/sections/TrendingSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import PromoSection from "@/components/sections/PromoSection";
import BrandStorySection from "@/components/sections/BrandStorySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedSection />
        <ShopSection />
        <NewArrivalsSection />
        <TrendingSection />
        <CollectionsSection />
        <PromoSection />
        <BrandStorySection />
        <ReviewsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
