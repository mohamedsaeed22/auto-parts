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
import { SEOMetadata } from "@/components/seo/SEOMetadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { seoConfig } from "@/lib/seo/config";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Scroll to top when page loads
  useScrollToTop();

  const { locale } = React.use(params);

  return (
    <div>
      <SEOMetadata
        title={seoConfig.defaultMetadata.home.title[locale as "en" | "ar"]}
        description={
          seoConfig.defaultMetadata.home.description[locale as "en" | "ar"]
        }
        keywords={seoConfig.company.keywords[locale as "en" | "ar"].join(", ")}
        locale={locale}
        type="website"
      />

      <StructuredData
        type="website"
        data={{
          name: seoConfig.company.name,
          description: seoConfig.company.description[locale as "en" | "ar"],
          url: seoConfig.siteUrl,
        }}
        locale={locale}
      />

      <main className="min-h-screen mt-10">
        <div className="container mx-auto">
          <h1 className="sr-only">
            {locale === "ar"
              ? "فال بارتس - قطع غيار السيارات والإكسسوارات المميزة أونلاين"
              : "FalParts - Premium Auto Parts & Car Accessories Online"}
          </h1>

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
