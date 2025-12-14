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
  const { t: tCommon } = useTranslation("common");
  const { data: sectionsResponse, isLoading, error } = useGetSectionsQuery({});

  if (isLoading) {
    return (
      <section className="py-16">
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
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
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

  const sections = (sectionsResponse?.data?.items || []) as SectionData[];

  if (sections.length === 0) {
    return (
      <section className="py-16">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div>
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-neutral-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {t("noSections") || tCommon("noContent") || "No sections found"}
            </h3>
            <p className="text-neutral-600">
              {t("noSectionsDesc") ||
                tCommon("noData") ||
                "No sections are available at the moment."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="space-y-8">
        {sections.map((section: SectionData) => (
          <SectionSwiper key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
};

export default SectionsContainer;
