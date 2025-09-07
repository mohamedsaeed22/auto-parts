"use client";
import React from "react";
import { useGetSectionsQuery } from "@/services/api";
import { SectionData } from "@/services/api/sectionsApi";
import SectionSwiper from "./SectionSwiper";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const SectionsContainer: React.FC = () => {
  const { t } = useTranslation("sections");
  const { data: sectionsResponse, isLoading, error } = useGetSectionsQuery({});

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-8 w-64 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, itemIndex) => (
                  <Skeleton key={itemIndex} className="h-48 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
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

  const sections = (sectionsResponse?.data?.items || []) as SectionData[];

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
      {sections.map((section: SectionData) => (
        <SectionSwiper key={section.id} section={section} />
      ))}
    </div>
  );
};

export default SectionsContainer;
