"use client";

import { useTranslation } from "react-i18next";

interface InformationPanelProps {
  userType: string;
}

export function InformationPanel({ userType }: InformationPanelProps) {
  const { t, i18n } = useTranslation("userPricing");
  const isRTL = i18n.language === "ar";

  const generalInfo = t("information.general", {
    returnObjects: true,
  }) as string[];
  const workshopInfo = t("information.workshop", {
    returnObjects: true,
  }) as string[];
  const storeInfo = t("information.store", { returnObjects: true }) as string[];

  return (
    <div className="mt-8 p-4 bg-logo-gold/10 rounded-lg border border-logo-gold/20">
      <h3
        className={`font-semibold text-logo-black mb-2 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("information.title")}
      </h3>
      <ul
        className={`text-sm text-logo-black/80 space-y-1 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {Array.isArray(generalInfo) &&
          generalInfo.map((info, index) => <li key={index}>• {info}</li>)}
        {userType === "workshop" &&
          Array.isArray(workshopInfo) &&
          workshopInfo.map((info, index) => (
            <li key={`workshop-${index}`}>• {info}</li>
          ))}
        {userType === "store" &&
          Array.isArray(storeInfo) &&
          storeInfo.map((info, index) => (
            <li key={`store-${index}`}>• {info}</li>
          ))}
      </ul>
    </div>
  );
}
