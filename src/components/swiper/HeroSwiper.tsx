"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useGetBannersQuery } from "@/services/hooks";
import { Banner } from "@/services/api/types";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

// Fallback image as a simple SVG data URL
const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OS4wODkgMTUwIDE2MiAxMzIuOTExIDE2MiAxMTJDMTYyIDkxLjA4OSAxNzkuMDg5IDc0IDIwMCA3NEMyMjAuOTExIDc0IDIzOCA5MS4wODkgMjM4IDExMkMyMzggMTMyLjkxMSAyMjAuOTExIDE1MCAyMDAgMTUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAwIDIyNkgyMDBWMTc0SDEwMFYyMjZIMFYyNzRIMTAwVjMyNkgyMDBWMjc0SDMwMFYyMjZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";

const HeroSwiper = () => {
  const { t } = useTranslation("common");
  const swiperRef = useRef<SwiperType | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [imageLoadAttempts, setImageLoadAttempts] = useState<
    Map<string, number>
  >(new Map());
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [containerHeight, setContainerHeight] = useState<string>("220px");

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

  // Set initial height based on screen size (more flexible for full image display)
  useEffect(() => {
    const setInitialHeight = () => {
      if (typeof window !== "undefined") {
        const screenWidth = window.innerWidth;
        let initialHeight;

        if (screenWidth < 640) {
          initialHeight = "250px"; // Mobile: allow more height for various aspect ratios
        } else if (screenWidth < 768) {
          initialHeight = "300px"; // Small tablets
        } else if (screenWidth < 1024) {
          initialHeight = "350px"; // Medium screens
        } else {
          initialHeight = "400px"; // Large screens
        }

        setContainerHeight(initialHeight);
      }
    };

    setInitialHeight();
  }, []);

  // Handle window resize to recalculate container height
  useEffect(() => {
    const handleResize = () => {
      if (imageLoaded) {
        // Find the first loaded image to recalculate height
        const images = document.querySelectorAll("img[data-banner-image]");
        if (images.length > 0) {
          const firstImage = images[0] as HTMLImageElement;
          if (firstImage.complete && firstImage.naturalWidth) {
            const aspectRatio =
              firstImage.naturalWidth / firstImage.naturalHeight;
            const screenWidth = window.innerWidth;
            let containerWidth = screenWidth;

            // Apply responsive max-widths
            if (screenWidth >= 1536)
              containerWidth = Math.min(screenWidth * 0.9, 1400);
            else if (screenWidth >= 1280)
              containerWidth = Math.min(screenWidth * 0.9, 1200);
            else if (screenWidth >= 1024)
              containerWidth = Math.min(screenWidth * 0.9, 1000);
            else if (screenWidth >= 768)
              containerWidth = Math.min(screenWidth * 0.95, 800);
            else if (screenWidth >= 640)
              containerWidth = Math.min(screenWidth * 0.95, 600);
            else containerWidth = screenWidth * 0.95;

            // Calculate height that shows the full image (object-contain)
            const idealHeight = containerWidth / aspectRatio;

            // Set reasonable limits but prioritize showing full image
            let minHeight, maxHeight;

            if (screenWidth < 640) {
              // Mobile: allow more flexible heights
              minHeight = 150;
              maxHeight = Math.min(
                0.8 * window.innerHeight,
                Math.min(400, screenWidth * 0.8)
              );
            } else if (screenWidth < 768) {
              // Small tablets
              minHeight = 180;
              maxHeight = Math.min(
                0.8 * window.innerHeight,
                Math.min(450, screenWidth * 0.7)
              );
            } else if (screenWidth < 1024) {
              // Medium screens
              minHeight = 200;
              maxHeight = Math.min(
                0.8 * window.innerHeight,
                Math.min(500, screenWidth * 0.6)
              );
            } else {
              // Large screens
              minHeight = 250;
              maxHeight = Math.min(0.8 * window.innerHeight, 600);
            }

            // Prefer ideal height but respect limits
            const optimalHeight = Math.max(
              minHeight,
              Math.min(maxHeight, idealHeight)
            );

            setContainerHeight(`${optimalHeight}px`);
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageLoaded]);

  // Handle image load success
  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      // Calculate optimal height to show full image without cropping
      const getOptimalHeight = () => {
        const screenWidth = window.innerWidth;
        let containerWidth = screenWidth;

        // Apply responsive max-widths based on container constraints
        if (screenWidth >= 1536)
          containerWidth = Math.min(screenWidth * 0.9, 1400); // 2xl
        else if (screenWidth >= 1280)
          containerWidth = Math.min(screenWidth * 0.9, 1200); // xl
        else if (screenWidth >= 1024)
          containerWidth = Math.min(screenWidth * 0.9, 1000); // lg
        else if (screenWidth >= 768)
          containerWidth = Math.min(screenWidth * 0.95, 800); // md
        else if (screenWidth >= 640)
          containerWidth = Math.min(screenWidth * 0.95, 600); // sm
        else containerWidth = screenWidth * 0.95; // mobile

        // Calculate height that shows the full image (object-contain)
        const idealHeight = containerWidth / aspectRatio;

        // Set reasonable limits but prioritize showing full image
        let minHeight, maxHeight;

        if (screenWidth < 640) {
          // Mobile: allow more flexible heights
          minHeight = 150;
          maxHeight = Math.min(
            0.8 * window.innerHeight,
            Math.min(400, screenWidth * 0.8)
          );
        } else if (screenWidth < 768) {
          // Small tablets
          minHeight = 180;
          maxHeight = Math.min(
            0.8 * window.innerHeight,
            Math.min(450, screenWidth * 0.7)
          );
        } else if (screenWidth < 1024) {
          // Medium screens
          minHeight = 200;
          maxHeight = Math.min(
            0.8 * window.innerHeight,
            Math.min(500, screenWidth * 0.6)
          );
        } else {
          // Large screens
          minHeight = 250;
          maxHeight = Math.min(0.8 * window.innerHeight, 600);
        }

        // Prefer ideal height but respect limits
        return Math.max(minHeight, Math.min(maxHeight, idealHeight));
      };

      const optimalHeight = getOptimalHeight();
      setContainerHeight(`${optimalHeight}px`);
      setImageLoaded(true);
    },
    []
  );

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
      <div className="relative bg-background rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl w-full">
        <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="relative bg-background rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl w-full">
        <div className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px] xl:h-[450px] flex items-center justify-center">
          <div className="text-center p-4">
            <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-red-500 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 mb-1 sm:mb-2">
              {t("errorLoadingData") || "Error loading data"}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 mb-2 sm:mb-4">
              {t("errorLoadingDataDesc") ||
                "There was an error loading the data. Please try again."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-secondary text-white text-xs sm:text-sm rounded-lg hover:bg-secondary-dark transition-colors"
            >
              {t("tryAgain") || "Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No banners found
  if (banners.length === 0) {
    return (
      <div className="relative bg-background rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl w-full">
        <div className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px] xl:h-[450px] flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <AlertCircle className="text-neutral-400" size={16} />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 mb-1 sm:mb-2">
              {t("noBannersFound") || "No banners found"}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-neutral-600">
              {t("noBannersFoundDesc") ||
                "No banners are available at the moment."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-background rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl w-full">
      <div
        className="relative w-full transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          height: containerHeight,
          minHeight: "150px",
          maxHeight: "80vh",
        }}
      >
        {/* Custom previous button */}
        <button
          className="cursor-pointer absolute left-1 sm:left-2 md:left-3 lg:left-4 top-1/2 z-20 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full shadow-lg hover:bg-background transition-all duration-200 border border-neutral-200/50"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-neutral-700"
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
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          className="hero-swiper w-full h-full"
        >
          {banners.map((banner: Banner) => {
            const imageSrc = getImageSrc(banner);

            return (
              <SwiperSlide key={banner.id} className="w-full h-full">
                <div className="relative w-full h-full bg-neutral-50 overflow-hidden">
                  {banner.link ? (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <Image
                        src={imageSrc}
                        alt={`Banner ${banner.id}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, (max-width: 1536px) 100vw, 100vw"
                        priority
                        className="object-contain object-center transition-opacity duration-300 w-full h-full"
                        onLoad={handleImageLoad}
                        onError={() => handleImageError(banner.image)}
                        unoptimized={imageSrc === FALLBACK_IMAGE}
                        data-banner-image="true"
                      />
                    </a>
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={`Banner ${banner.id}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, (max-width: 1536px) 100vw, 100vw"
                      priority
                      className="object-contain transition-opacity duration-300"
                      onLoad={handleImageLoad}
                      onError={() => handleImageError(banner.image)}
                      unoptimized={imageSrc === FALLBACK_IMAGE}
                      data-banner-image="true"
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom next button */}
        <button
          className="cursor-pointer absolute right-1 sm:right-2 md:right-3 lg:right-4 top-1/2 z-20 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full shadow-lg hover:bg-background transition-all duration-200 border border-neutral-200/50"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-neutral-700"
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
  );
};

export default HeroSwiper;
