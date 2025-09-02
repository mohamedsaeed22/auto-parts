"use client";

import HeroSwiper from "@/components/ecommerce/swiper/HeroSwiper";
import Brands from "@/components/ecommerce/brand/Brands";
import OffersSwiper from "@/components/ecommerce/swiper/OffersSwiper";
import ProductsList from "@/components/ecommerce/ProductsList";
import SectionsContainer from "@/components/ecommerce/sections/SectionsContainer";
import CategoriesSection from "@/components/ecommerce/sections/CategoriesSection";
import Partners from "@/components/common/partners/Partners";
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
