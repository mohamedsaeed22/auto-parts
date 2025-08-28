"use client";

import HeroSwiper from "@/components/swiper/HeroSwiper";
import Brands from "@/components/brand/Brands";
import OffersSwiper from "@/components/swiper/OffersSwiper";
import ProductsList from "@/components/product/ProductsList";
import SectionsContainer from "@/components/sections/SectionsContainer";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen mt-10">
        <div className="container mx-auto">
          <HeroSwiper />
          <Brands />
          <OffersSwiper />

          {/* Sections from API */}
          <SectionsContainer />

          <ProductsList />
        </div>
      </main>
    </div>
  );
}
