"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

const SwiperCarousel = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  // Sample images - replace with your actual image URLs
  const slides = [
    {
      id: 1,
      src: "/swiper/swiper-img1.webp",
      alt: "Modern office building",
    },
    {
      id: 2,
      src: "/swiper/swiper-img2.webp",
      alt: "Business meeting",
    },
    {
      id: 3,
      src: "/swiper/swiper-img3.webp",
      alt: "Technology workspace",
    },
    {
      id: 4,
      src: "/swiper/swiper-img2.webp",
      alt: "City skyline",
    },
  ];

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-1xl">
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
        // spaceBetween={30}
        effect={"fade"}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="w-full h-full object-cover"
            />
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
  );
};

export default SwiperCarousel;
