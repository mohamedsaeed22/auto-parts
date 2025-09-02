"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useGetBannersQuery } from "@/services/hooks";
import { Banner } from "@/services/api/types";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback image as a simple SVG data URL
const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OS4wODkgMTUwIDE2MiAxMzIuOTExIDE2MiAxMTJDMTYyIDkxLjA4OSAxNzkuMDg5IDc0IDIwMCA3NEMyMjAuOTExIDc0IDIzOCA5MS4wODkgMjM4IDExMkMyMzggMTMyLjkxMSAyMjAuOTExIDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDIyNkgyMDBWMTc0SDEwMFYyMjZIMFYyNzRIMTAwVjMyNkgyMDBWMjc0SDMwMFYyMjZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";

const HeroSwiper = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [imageLoadAttempts, setImageLoadAttempts] = useState<
    Map<string, number>
  >(new Map());

  // API hook to fetch banners with error handling
  const {
    data: bannersResponse,
    isLoading,
    error,
    refetch,
  } = useGetBannersQuery(undefined, {
    // Prevent infinite retries
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Extract banners from response
  const banners = bannersResponse?.data?.items || [];

  // Handle image load error
  const handleImageError = (imageUrl: string) => {
    const attempts = imageLoadAttempts.get(imageUrl) || 0;

    if (attempts >= 1) {
      // After first attempt, mark as failed and use fallback
      setFailedImages((prev) => new Set(prev).add(imageUrl));
    } else {
      // Increment attempt count
      setImageLoadAttempts((prev) => new Map(prev).set(imageUrl, attempts + 1));
    }
  };

  // Get the appropriate image source
  const getImageSrc = (banner: Banner) => {
    if (failedImages.has(banner.image)) {
      return FALLBACK_IMAGE;
    }
    return banner.image;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="relative bg-background rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="relative bg-background rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Error loading banners
          </h3>
          <p className="text-neutral-600 mb-4">
            There was an error loading the banners. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
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
      <div className="relative bg-background rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-neutral-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No banners found
          </h3>
          <p className="text-neutral-600">
            No banners are available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-background rounded-3xl overflow-hidden shadow-1xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
      {/* Custom previous button */}
      <button
        className="cursor-pointer absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2 bg-background p-2 sm:p-3 rounded-full shadow-lg hover:bg-neutral-50 transition-colors"
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
        {banners.map((banner: Banner) => {
          const imageSrc = getImageSrc(banner);

          return (
            <SwiperSlide key={banner.id} className="w-full h-full">
              <div className="relative w-full h-full">
                {banner.link ? (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={imageSrc}
                      alt={`Banner ${banner.id}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                      priority
                      className="object-cover"
                      onError={() => handleImageError(banner.image)}
                      unoptimized={imageSrc === FALLBACK_IMAGE}
                    />
                  </a>
                ) : (
                  <Image
                    src={imageSrc}
                    alt={`Banner ${banner.id}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    priority
                    className="object-cover"
                    onError={() => handleImageError(banner.image)}
                    unoptimized={imageSrc === FALLBACK_IMAGE}
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom next button */}
      <button
        className="cursor-pointer absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2 bg-background p-2 sm:p-3 rounded-full shadow-lg hover:bg-neutral-50 transition-colors"
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
