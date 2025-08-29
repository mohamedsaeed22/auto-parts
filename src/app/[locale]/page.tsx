"use client";

import HeroSwiper from "@/components/swiper/HeroSwiper";
import Brands from "@/components/brand/Brands";
import OffersSwiper from "@/components/swiper/OffersSwiper";
import ProductsList from "@/components/product/ProductsList";
import SectionsContainer from "@/components/sections/SectionsContainer";
import CategoriesSection from "@/components/sections/CategoriesSection";
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
      </main>
    </div>
  );
}
