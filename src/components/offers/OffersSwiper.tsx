"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useGetOffersQuery } from "@/services/hooks";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

const OffersSwiper = () => {
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ar";
  const swiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();

  // Keep existing logic: fetch offers from API
  const { data: offersResponse } = useGetOffersQuery();
  const slides = (offersResponse?.data?.items || []).map((offer) => ({
    id: offer.id,
    src: offer.image,
    alt: `Offer ${offer.id}`,
  }));
  const slidesWithImages = slides.filter((s) => !!s.src);

  return (
    <section className="py-16 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            {t("offers.title")}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {t("offers.description")}
          </p>
        </div>

        <div className="relative">
          {slidesWithImages.length === 0 ? (
            <div className="w-full py-12 bg-neutral-50 border border-neutral-200 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-neutral-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {t("offers.noOffers") || "No offers found"}
                </h3>
                <p className="text-neutral-600">
                  {t("offers.noOffersDesc") ||
                    "No offers are available at the moment."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Custom previous button */}
              <button
                className={`cursor-pointer absolute top-1/2 z-10 -translate-y-1/2 bg-background p-3 rounded-full shadow-lg hover:bg-neutral-50 transition-colors ${
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
                    // spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: 3,
                   },
                  1024: {
                    slidesPerView: 5,
                     
                  },
                }}
                grabCursor={true}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation, Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                className="packages-swiper"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {slidesWithImages.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <div
                      className="relative w-full h-full group cursor-pointer"
                      onClick={() => router.push(`/offers/${slide.id}`)}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="rounded-3xl object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-3xl flex items-center justify-center">
                        <div className="bg-background bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {t("offers.viewOffer") || "View Offer"}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom next button */}
              <button
                className={`cursor-pointer absolute top-1/2 z-10 -translate-y-1/2 bg-background p-3 rounded-full shadow-lg hover:bg-neutral-50 transition-colors ${
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OffersSwiper;
