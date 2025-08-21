"use client";
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Brands = () => {
  const { t, i18n } = useTranslation("brands");
  const isRTL = i18n.language === "ar";

  // Sample car brands - you can replace these with actual brand logos
  const brands = [
    {
      id: 1,
      key: "mercedes",
      logo: "/brands/brand1.png", // You'll need to add these images
    },
    {
      id: 2,
      key: "bmw",
      logo: "/brands/brand2.png",
    },
    {
      id: 3,
      key: "audi",
      logo: "/brands/brand3.png",
    },
    {
      id: 4,
      key: "toyota",
      logo: "/brands/brand4.png",
    },
    {
      id: 5,
      key: "honda",
      logo: "/brands/brand5.png",
    },
    {
      id: 6,
      key: "ford",
      logo: "/brands/brand6.png",
    },
    {
      id: 7,
      key: "volkswagen",
      logo: "/brands/brand7.png",
    },
    {
      id: 8,
      key: "nissan",
      logo: "/brands/brand8.png",
    },
  ];

  return (
    <section
      className="py-16 bg-gray-50 rounded-3xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-6 md:gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group relative flex flex-col items-center"
            >
              {/* Background circle with brand-bg.png */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* Background with golden color */}
                <div
                  className="absolute inset-0 bg-[#b9974d] opacity-20"
                  style={{ backgroundColor: "#b9974d" }}
                />

                {/* Brand logo overlay */}
                <div className="absolute inset-0 flex items-center justify-center duration-300">
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 relative">
                    <Image
                      src={brand.logo}
                      alt={t(`brands.${brand.key}`)}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Brand name */}
              <p className="mt-4 text-base md:text-lg font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300">
                {t(`brands.${brand.key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
