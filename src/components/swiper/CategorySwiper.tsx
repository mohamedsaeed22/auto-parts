"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import ProductCard from "../product/ProductCard";
import { products } from "../product/productsData";
import { useTranslation } from "react-i18next";

interface CategoryProps {
  title: string;
  backgroundImage: string;
}

const CategorySwiper: React.FC<CategoryProps> = ({
  title,
  backgroundImage,
}) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section
      className="relative pt-16 pb-11 overflow-hidden rounded-lg"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={title}
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
            className={`cursor-pointer absolute top-1/2 z-20 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors ${
              isRTL ? "right-4" : "left-4"
            }`}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label={t("category.previousSlide")}
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
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="category-swiper"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div>
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom next button */}
          <button
            className={`cursor-pointer absolute top-1/2 z-20 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors ${
              isRTL ? "left-4" : "right-4"
            }`}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label={t("category.nextSlide")}
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
            {t("category.viewAllProducts", { category: title })}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySwiper;
