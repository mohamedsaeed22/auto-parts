"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";

const PackagesOffers = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const slides = [
    {
      id: 1,
      src: "/offers/offer1.jpg",
      alt: "Modern office building",
    },
    {
      id: 2,
      src: "/offers/offer2.jpg",
      alt: "Modern office building",
    },

    {
      id: 3,
      src: "/offers/offer3.jpg",
      alt: "Modern office building",
    },
    {
      id: 4,
      src: "/offers/offer4.jpg",
      alt: "Modern office building",
    },
    {
      id: 5,
      src: "/offers/offer5.jpg",
      alt: "Modern office building",
    },
    {
      id: 6,
      src: "/offers/offer6.jpg",
      alt: "Modern office building",
    },
    {
      id: 7,
      src: "/offers/offer7.jpg",
      alt: "Modern office building",
    },
  
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            الباقات والعروض
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة متنوعة من الباقات والعروض المميزة على قطع الغيار
            والإكسسوارات
          </p>
        </div>

        <div className="relative">
          {/* Custom previous button */}
          <button
            className="cursor-pointer absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            onClick={() => swiperRef.current?.slidePrev()}
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={4}
            centeredSlides={true}
            spaceBetween={30}
            grabCursor={true}
            loop={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Navigation]}
            className="packages-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <Image src={slide.src} alt={slide.alt} fill />
              </SwiperSlide>
            ))}

          </Swiper>

          {/* Custom next button */}
          <button
            className="cursor-pointer absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            onClick={() => swiperRef.current?.slideNext()}
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
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PackagesOffers;
