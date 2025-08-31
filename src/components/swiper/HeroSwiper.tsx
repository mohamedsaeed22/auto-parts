"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useGetBannersQuery } from "@/services/hooks";
import { Banner } from "@/services/api/types";
import { Loader2, AlertCircle } from "lucide-react";

const HeroSwiper = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  // API hook to fetch banners
  const {
    data: bannersResponse,
    isLoading,
    error,
    refetch,
  } = useGetBannersQuery();

  // Extract banners from response
  const banners = bannersResponse?.data?.items || [];

  // Loading component
  if (isLoading) {
    return (
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading banners
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the banners. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No banners found
  if (banners.length === 0) {
    return (
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No banners found
          </h3>
          <p className="text-gray-600">
            No banners are available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
      {/* Custom previous button */}
      <button
        className="cursor-pointer absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 sm:w-6 sm:h-6"
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
        effect={"fade"}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
      >
        {banners.map((banner: Banner) => (
          <SwiperSlide key={banner.id} className="w-full h-full">
            <div className="relative w-full h-full">
              {banner.link ? (
                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={banner.image}
                    alt={`Banner ${banner.id}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    priority
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-banner.png";
                    }}
                  />
                </a>
              ) : (
                <Image
                  src={banner.image}
                  alt={`Banner ${banner.id}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  priority
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-banner.png";
                  }}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom next button */}
      <button
        className="cursor-pointer absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 sm:w-6 sm:h-6"
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

export default HeroSwiper;
