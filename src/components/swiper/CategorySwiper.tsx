"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import ProductCard from "../product/ProductCard";
import { useTranslation } from "react-i18next";
import { useGetProductsMutation } from "@/services/hooks";
import { Product } from "@/services/api/types";
import { Loader2, AlertCircle } from "lucide-react";

interface CategoryProps {
  title: string;
  backgroundImage: string;
  categoryId?: number; // Optional category ID to filter products
}

const CategorySwiper: React.FC<CategoryProps> = ({
  title,
  backgroundImage,
  categoryId,
}) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const swiperRef = useRef<SwiperType | null>(null);

  // API hook to fetch products
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  // Extract products from response
  const products = productsResponse?.data?.items || [];

  // Fetch products on component mount
  React.useEffect(() => {
    const filters = categoryId
      ? { category_id: categoryId, per_page: 10 }
      : { per_page: 10 };
    getProducts(filters);
  }, [categoryId, getProducts]);

  // Refetch products on auth change (login/logout)
  React.useEffect(() => {
    const handleAuthChange = () => {
      const filters = categoryId
        ? { category_id: categoryId, per_page: 10 }
        : { per_page: 10 };
      getProducts(filters);
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [categoryId, getProducts]);

  // Loading component
  if (isLoading) {
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
          <div className="relative mt-60">
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="text-white">
                  {t("loadingProducts") || "Loading products..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error component
  if (error) {
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
          <div className="relative mt-60">
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("errorLoadingProducts") || "Error loading products"}
                </h3>
                <p className="text-white/80 mb-4">
                  {t("errorLoadingProductsDesc") ||
                    "There was an error loading the products. Please try again."}
                </p>
                <button
                  onClick={() => {
                    const filters = categoryId
                      ? { category_id: categoryId, per_page: 10 }
                      : { per_page: 10 };
                    getProducts(filters);
                  }}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {t("tryAgain") || "Try Again"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No products found
  if (products.length === 0) {
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
                    "No products are available in this category."}
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
            {products.map((product: Product) => (
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
