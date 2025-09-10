"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGetPartnersQuery } from "@/services/hooks";
import { useTranslation } from "react-i18next";
import { Loader2, AlertCircle } from "lucide-react";

const Partners = () => {
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // API hook to fetch partners
  const { data: partnersResponse, isLoading, error } = useGetPartnersQuery();

  // Extract partners from response
  const partners = partnersResponse?.data?.partners || [];

  // Auto-scroll effect
  useEffect(() => {
    if (isHovered || partners.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 1;
    let animationId: number;

    const scroll = () => {
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
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
  }, [isHovered, partners.length]);

  // Loading component
  if (isLoading) {
    return (
      <section className="py-12 bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              {t("partners.title") || "Our Trusted Partners"}
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <p className="text-neutral-600 text-sm">
                {t("loadingPartners") || "Loading partners..."}
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
      <section className="py-12 bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">
              {t("partnersError") || "Failed to load partners"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section className="py-12 bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              {t("partners.title") || "Our Trusted Partners"}
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-neutral-600">
              {t("noPartners") || "No partners available at the moment"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
            {t("partners.title") || "Our Trusted Partners"}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {t("partners.description") ||
              "Working with leading companies worldwide"}
          </p>
        </div>

        {/* Partners Carousel */}
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrollable container */}
          <div
            ref={containerRef}
            className="flex items-center gap-8 md:gap-12 overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Duplicate partners for seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <div key={`${partner}-${index}`} className="flex-shrink-0 group">
                <div className="relative w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24 bg-white rounded-lg shadow-sm border border-neutral-200 flex items-center justify-center p-4 transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-primary-200">
                  <Image
                    src={partner}
                    alt={`Partner ${index + 1}`}
                    width={120}
                    height={60}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  {/* Fallback for broken images */}
                  <div className="hidden w-16 h-8 bg-neutral-100 rounded flex items-center justify-center">
                    <span className="text-neutral-400 text-xs font-medium">
                      Partner
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-neutral-500 text-sm">
            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-pulse" />
            <span>
              {t("partners.scrollHint") || "Scroll to see more partners"}
            </span>
            <div className="w-2 h-2 bg-neutral-300 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Partners;
