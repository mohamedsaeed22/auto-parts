"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGetPartnersQuery } from "@/services/hooks";
import { useTranslation } from "react-i18next";
import { Loader2, AlertCircle } from "lucide-react";

const Partners = () => {
  const { t, i18n } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // API hook to fetch partners
  const { data: partnersResponse, isLoading, error } = useGetPartnersQuery();

  // Extract partners from response
  const partners = partnersResponse?.data?.partners || [];

  // Create enough duplicates for seamless scrolling
  const getRepeatedPartners = () => {
    if (partners.length === 0) return [];
    // Repeat partners at least 6 times to ensure smooth infinite scroll
    const repeats = Math.max(6, Math.ceil(20 / partners.length));
    return Array(repeats).fill(partners).flat();
  };

  const repeatedPartners = getRepeatedPartners();

  // Auto-scroll effect
  useEffect(() => {
    if (!containerRef.current || isHovered || partners.length === 0) return;

    const container = containerRef.current;
    const scrollSpeed = 1; // pixels per frame
    let animationId: number;

    const scroll = () => {
      // Calculate the width of one set of partners
      const singleSetWidth = (container.scrollWidth / repeatedPartners.length) * partners.length;
      
      if (container.scrollLeft >= singleSetWidth) {
        // Reset to beginning for seamless loop
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered, partners.length, repeatedPartners.length]);

  // Loading component
  if (isLoading) {
    return (
      <section className="py-16 bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
            {t("partners.title") || "Our Trusted Partners"}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {t("partners.description") ||
              "Working with leading companies worldwide"}
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-600" />
            <p className="text-neutral-600 text-sm">
              {tCommon("loadingData") ||
                t("loadingPartners") ||
                "Loading partners..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Error component
  if (error) {
    return (
      <section className="py-16 bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
            {t("partners.title") || "Our Trusted Partners"}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {t("partners.description") ||
              "Working with leading companies worldwide"}
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {tCommon("errorLoadingData") || "Error loading data"}
            </h3>
            <p className="text-neutral-600">
              {tCommon("errorLoadingDataDesc") ||
                "There was an error loading the data. Please try again."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No partners found
  if (partners.length === 0) {
    return (
      <section className="py-16 bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
            {t("partners.title") || "Our Trusted Partners"}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {t("partners.description") ||
              "Working with leading companies worldwide"}
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-neutral-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {t("partners.noPartners") || "No partners found"}
            </h3>
            <p className="text-neutral-600">
              {tCommon("noData") || "No data available"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
          {t("partners.title") || "Our Trusted Partners"}
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          {t("partners.description") ||
            "Working with leading companies worldwide"}
        </p>
      </div>

      {/* Partners Logos Container */}
      <div className="relative">
        {/* Gradient Overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <div
          ref={containerRef}
          dir="ltr"
          className="flex items-center gap-8 md:gap-12 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Repeated partners for seamless infinite loop */}
          {repeatedPartners.map((partner, index) => (
            <div key={`partner-${index}`} className="flex-shrink-0 group">
              <div className="relative w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24 bg-white rounded-lg shadow-sm border border-neutral-200 flex items-center justify-center p-4 transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-primary-200">
                <Image
                  src={partner}
                  alt={`Partner ${(index % partners.length) + 1}`}
                  width={120}
                  height={60}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                {/* Fallback placeholder */}
                <div className="hidden w-16 h-8 bg-neutral-100 rounded justify-center items-center">
                  <span className="text-neutral-400 text-xs font-medium">
                    Partner
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 text-neutral-500 text-sm">
          <div className="w-2 h-2 bg-neutral-300 rounded-full animate-pulse" />
          <span>
            {t("partners.scrollHint") || "Scroll to see more partners"}
          </span>
          <div className="w-2 h-2 bg-neutral-300 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Partners;