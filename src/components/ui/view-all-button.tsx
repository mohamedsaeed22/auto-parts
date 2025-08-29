"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

interface ViewAllButtonProps {
  href: string;
  translationKey: string;
  fallbackText: string;
  namespace?: string;
  className?: string;
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  href,
  translationKey,
  fallbackText,
  namespace,
  className = "",
}) => {
  const router = useRouter();
  const { t, i18n } = useTranslation(namespace);
  const isRTL = i18n.language === "ar";

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div className="text-center mt-12">
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      >
        <span>{t(translationKey) || fallbackText}</span>
        <ArrowRight
          className={`w-4 h-4 transition-transform duration-300 ${
            isRTL ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default ViewAllButton;
