"use client";
import React from "react";
import { useGetSectionsQuery } from "@/services/api";
import { SectionsRequest, Section } from "@/services/api/sectionsApi";
import SectionSwiper from "../swiper/SectionSwiper";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const SectionsContainer: React.FC = () => {
  const { t } = useTranslation("sections");
  const { data: sectionsResponse, isLoading, error } = useGetSectionsQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-logo-gold" />
            <p className="text-gray-600">
              {t("loadingSections") || "Loading sections..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div>
            <AlertCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {t("error.title") || "Error loading sections"}
            </h2>
            <p className="text-gray-500">
              {t("error.message") || "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sections = (sectionsResponse?.data?.items || []) as Section[];

  if (sections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div>
            <AlertCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {t("empty.title") || "No sections found"}
            </h2>
            <p className="text-gray-500">
              {t("empty.message") || "No sections are available at the moment."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section: Section) => (
        <SectionSwiper key={section.id} section={section} />
      ))}
    </div>
  );
};

export default SectionsContainer;
