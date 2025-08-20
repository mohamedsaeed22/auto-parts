"use client";

import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation("userPricing");

  return (
    <div className="bg-gradient-to-r from-logo-gold to-logo-gold text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t("hero.title")}</h1>
          <p className="text-xl text-white/90 mb-4">{t("hero.subtitle")}</p>
          <p className="text-lg text-white/80">{t("hero.description")}</p>
        </div>
      </div>
    </div>
  );
}
