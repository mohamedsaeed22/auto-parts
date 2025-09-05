"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import ProductCard from "../product/ProductCard";
import { useTranslation } from "react-i18next";
import { SectionProduct } from "@/services/api/sectionsApi";
import { AlertCircle } from "lucide-react";

interface SectionSwiperProps {
  section: {
    id: number;
    title: string;
    image: string;
    products_count: number;
    products: SectionProduct[];
  };
}

const SectionSwiper: React.FC<SectionSwiperProps> = ({ section }) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const swiperRef = useRef<SwiperType | null>(null);

  // Extract products from section
  const products = section.products || [];

  // Loading component
  if (!products || products.length === 0) {
    return (
      <section
        className="relative pt-16 pb-11 overflow-hidden rounded-lg"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={section.image}
            alt={section.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="relative mt-60">
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("noProductsFound") || "No products found"}
                </h3>
                <p className="text-white/80">
                  {t("noProductsFoundDesc") ||
                    "No products are available in this section."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative pt-16 pb-11 overflow-hidden rounded-lg"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={section.image}
          alt={section.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Products Swiper */}
        <div className="relative mt-60">
          {/* Custom previous button */}
          <button
            className={`cursor-pointer absolute top-42 z-20 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors ${
              isRTL ? "right-4" : "left-4"
            }`}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label={t("section.previousSlide")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isRTL
                    ? "M8.25 4.5l7.5 7.5-7.5 7.5"
                    : "M15.75 19.5L8.25 12l7.5-7.5"
                }
              />
            </svg>
          </button>

          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="section-swiper"
            style={{ pointerEvents: "auto" }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {products.map((product: SectionProduct) => (
              <SwiperSlide key={product.id}>
                <div>
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      price: parseFloat(product.price),
                      final_price: product.final_price,
                      primary_image: product.primary_image,
                      description: product.hover_text,
                      product_identifier: product.product_identifier,
                      is_active: product.is_active,
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom next button */}
          <button
            className={`cursor-pointer absolute top-42 z-20 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors ${
              isRTL ? "left-4" : "right-4"
            }`}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label={t("section.nextSlide")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isRTL
                    ? "M15.75 19.5L8.25 12l7.5-7.5"
                    : "M8.25 4.5l7.5 7.5-7.5 7.5"
                }
              />
            </svg>
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            {t("section.viewAllProducts", { section: section.title })}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionSwiper;
