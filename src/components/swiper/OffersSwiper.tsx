"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useGetOffersQuery } from "@/services/hooks";
import { Offer } from "@/services/api/types";
import { Loader2, AlertCircle } from "lucide-react";

const OffersSwiper = () => {
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ar";
  const swiperRef = useRef<SwiperType | null>(null);

  // API hook to fetch offers
  const {
    data: offersResponse,
    isLoading,
    error,
    refetch,
  } = useGetOffersQuery();

  // Extract offers from response
  const offers = offersResponse?.data?.items || [];

  // Loading component
  if (isLoading) {
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

          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <p className="text-gray-600">
                {t("loadingOffers") || "Loading offers..."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error component
  if (error) {
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

          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("errorLoadingOffers") || "Error loading offers"}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("errorLoadingOffersDesc") ||
                  "There was an error loading the offers. Please try again."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t("tryAgain") || "Try Again"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No offers found
  if (offers.length === 0) {
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

          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("noOffersFound") || "No offers found"}
              </h3>
              <p className="text-gray-600">
                {t("noOffersFoundDesc") ||
                  "No offers are available at the moment."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="relative">
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
              {offers.map((offer: Offer) => (
                <SwiperSlide key={offer.id}>
                  <div className="relative w-full h-48 md:h-56 lg:h-64">
                    <Image
                      src={offer.image}
                      alt={`Offer ${offer.id}`}
                      fill
                      className="rounded-3xl object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-offer.png";
                      }}
                    />

                    {/* Text overlay on top of image */}
                    <div className="absolute top-3 left-3 right-3">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg inline-block">
                        {offer.discount_info}
                      </div>
                      <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium inline-block ml-2">
                        {offer.products_count}{" "}
                        {offer.products_count === 1 ? "Product" : "Products"}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom previous button - positioned relative to swiper container */}
            <button
              className={`cursor-pointer absolute top-1/3 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors ${
                isRTL ? "-right-6" : "-left-6"
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

            {/* Custom next button - positioned relative to swiper container */}
            <button
              className={`cursor-pointer absolute top-1/3 z-10 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors ${
                isRTL ? "-left-6" : "-right-6"
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
      </div>
    </section>
  );
};

export default OffersSwiper;