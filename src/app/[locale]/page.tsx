"use client";

import HeroSwiper from "@/components/swiper/HeroSwiper";
import Brands from "@/components/brand/Brands";
import OffersSwiper from "@/components/offers/OffersSwiper";
import ProductsList from "@/components/product/ProductsList";
import SectionsContainer from "@/components/sections/SectionsContainer";
import CategoriesSection from "@/components/sections/CategoriesSection";
import Partners from "@/components/partners/Partners";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Home() {
  // Scroll to top when page loads
  useScrollToTop();

  return (
    <div>
      <main className="min-h-screen mt-10">
        <div className="container mx-auto">
          <HeroSwiper />
          <Brands />
          <OffersSwiper />
          <CategoriesSection />
          <SectionsContainer />
          <ProductsList />
        </div>

        {/* Partners Section - Above Footer */}
        <Partners />
      </main>
    </div>
  );
}
