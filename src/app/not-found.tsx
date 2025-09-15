"use client";

import React, { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  ArrowLeft,
  Home,
  Search,
  Car,
  Wrench,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectLanguageSync } from "@/utils/languageUtils";

export default function NotFound() {
  const router = useRouter();
  const {} = useTranslation("common");

  // Detect language synchronously to prevent flash
  const { currentLang, isRTL } = detectLanguageSync();

  // Set document direction immediately to prevent flash
  useLayoutEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = currentLang;
    }
  }, [currentLang, isRTL]);

  // Debug logging
  if (typeof window !== "undefined") {
  }

  // Fallback translations for when i18n is not available
  const translations = {
    en: {
      pageNotFound: "Page Not Found",
      pageNotFoundDesc:
        "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.",
      goHome: "Go Home",
      goBack: "Go Back",
      needHelp: "Need Help?",
      searchProducts: "Search for products",
      browseCategories: "Browse categories",
      viewBrands: "View brands",
      errorCode: "Error Code: 404",
      falAlGharbia: "Fal Al Gharbia Auto Parts",
      home: "Home",
    },
    ar: {
      pageNotFound: "الصفحة غير موجودة",
      pageNotFoundDesc:
        "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون تم نقلها أو حذفها أو لا وجود لها.",
      goHome: "العودة للرئيسية",
      goBack: "رجوع",
      needHelp: "تحتاج مساعدة؟",
      searchProducts: "البحث عن المنتجات",
      browseCategories: "تصفح الفئات",
      viewBrands: "عرض العلامات التجارية",
      errorCode: "رمز الخطأ: 404",
      falAlGharbia: "فال الغربية لقطع غيار السيارات",
      home: "الرئيسية",
    },
  };

  const t_ = (key: string) => {
    // Always use our fallback translations for 404 page
    // Default to Arabic if current language is not found
    return (
      translations[currentLang as keyof typeof translations]?.[
        key as keyof (typeof translations)["en"]
      ] || translations.ar[key as keyof (typeof translations)["ar"]]
    );
  };

  const handleGoHome = () => {
    router.push(`/${currentLang}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${
        isRTL ? "rtl-layout" : "ltr-layout"
      }`}
      style={{
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isRTL ? "فال الغربية" : "Fal Al Gharbia"}
                </h1>
                <p className="text-sm text-gray-500">
                  {isRTL ? "قطع غيار السيارات" : "Auto Parts"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              {t_("home")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="w-64 h-64 mx-auto relative">
              {/* Car Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Car className="h-16 w-16 text-primary" />
                </div>
              </div>

              {/* 404 Text */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="text-8xl font-bold text-primary/20">4</div>
              </div>
              <div className="absolute top-0 right-0">
                <div className="text-8xl font-bold text-primary/20">4</div>
              </div>

              {/* Warning Icon */}
              <div className="absolute -top-4 -right-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              {t_("pageNotFound")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto">
              {t_("pageNotFoundDesc")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGoHome}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              <Home className="h-5 w-5 mr-2" />
              {t_("goHome")}
            </Button>

            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full sm:w-auto px-8 py-3"
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t_("goBack")}
            </Button>

            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-full sm:w-auto px-8 py-3"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              {t_("refresh")}
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t_("needHelp")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <span className="text-gray-600">{t_("searchProducts")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <span className="text-gray-600">{t_("browseCategories")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-gray-600">{t_("viewBrands")}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {t_("errorCode")} • {t_("falAlGharbia")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
