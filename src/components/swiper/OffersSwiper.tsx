"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const OffersSwiper = () => {
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ar";
  const swiperRef = useRef<SwiperType | null>(null);

  const slides = [
    {
      id: 1,
      src: "/offers/offer1.jpg",
      alt: t("offers.offer1.alt"),
    },
    {
      id: 2,
      src: "/offers/offer2.jpg",
      alt: t("offers.offer2.alt"),
    },
    {
      id: 3,
      src: "/offers/offer3.jpg",
      alt: t("offers.offer3.alt"),
    },
    {
      id: 4,
      src: "/offers/offer4.jpg",
      alt: t("offers.offer4.alt"),
    },
    {
      id: 5,
      src: "/offers/offer5.jpg",
      alt: t("offers.offer5.alt"),
    },
    {
      id: 6,
      src: "/offers/offer6.jpg",
      alt: t("offers.offer6.alt"),
    },
    {
      id: 7,
      src: "/offers/offer7.jpg",
      alt: t("offers.offer7.alt"),
    },
  ];

  return (
    <section className="py-16 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("offers.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("offers.description")}
          </p>
        </div>

        <div className="relative">
          {/* Custom previous button */}
          <button
            className={`cursor-pointer absolute top-1/2 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors ${
              isRTL ? "right-4" : "left-4"
            }`}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label={t("offers.previousSlide")}
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
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            grabCursor={true}
            loop={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Navigation]}
            className="packages-swiper"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="rounded-3xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom next button */}
          <button
            className={`cursor-pointer absolute top-1/2 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors ${
              isRTL ? "left-4" : "right-4"
            }`}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label={t("offers.nextSlide")}
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
      </div>
    </section>
  );
};

export default OffersSwiper;
