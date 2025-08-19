"use client";

import HeroSwiper from "@/components/swiper/HeroSwiper";
import Brands from "@/components/Brands";
import OffersSwiper from "@/components/swiper/OffersSwiper";
import ProductsList from "@/components/product/ProductsList";
import CategorySwiper from "@/components/swiper/CategorySwiper";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <main className="min-h-screen mt-10">
        <div className="container mx-auto">
          <HeroSwiper />
          <Brands />
          <OffersSwiper />

          {/* Example Category Section */}
          <CategorySwiper
            title={t("قطع غيار المحرك")}
            // description="اكتشف مجموعة واسعة من قطع غيار المحرك عالية الجودة لضمان أداء مثالي لسيارتك"
            backgroundImage="/categories/cat-bg-1.jpg"
            // categoryFilter="الفرامل"
          />

          <ProductsList />
          {/* You can add more category sections */}
          <CategorySwiper
            title="الزيوت والمواد التشحيم"
            // description="زيوت محرك عالية الجودة ومواد تشحيم متقدمة لحماية محرك سيارتك"
            backgroundImage="/categories/cat-bg-2.jpg"
            // categoryFilter="الزيوت"
          />
        </div>
      </main>
    </div>
  );
}
