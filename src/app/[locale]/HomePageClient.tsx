"use client";

import React from "react";
import HeroSwiper from "@/components/swiper/HeroSwiper";
import Brands from "@/components/brand/Brands";
import OffersSwiper from "@/components/offers/OffersSwiper";
import ProductsList from "@/components/product/ProductsList";
import SectionsContainer from "@/components/section/SectionsContainer";
import CategoriesSection from "@/components/sections/CategoriesSection";
import Partners from "@/components/partners/Partners";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PaymentAlert from "@/components/payment/PaymentAlert";

export default function HomePageClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Scroll to top when page loads
  useScrollToTop();

  const [locale, setLocale] = React.useState<string>("ar");

  React.useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

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
          <Partners />
        </div>
      </main>

      <PaymentAlert />
    </div>
  );
}
