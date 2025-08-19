"use client";

import { useTranslation } from "react-i18next";

interface InformationPanelProps {
  userType: string;
}

export function InformationPanel({ userType }: InformationPanelProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const generalInfo = t("userPricing.information.general", { returnObjects: true }) as string[];
  const workshopInfo = t("userPricing.information.workshop", { returnObjects: true }) as string[];
  const storeInfo = t("userPricing.information.store", { returnObjects: true }) as string[];

  return (
    <div className="mt-8 p-4 bg-logo-gold/10 rounded-lg border border-logo-gold/20">
      <h3 className={`font-semibold text-logo-black mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t("userPricing.information.title")}
      </h3>
      <ul className={`text-sm text-logo-black/80 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        {generalInfo.map((info, index) => (
          <li key={index}>• {info}</li>
        ))}
        {userType === "workshop" && workshopInfo.map((info, index) => (
          <li key={`workshop-${index}`}>• {info}</li>
        ))}
        {userType === "store" && storeInfo.map((info, index) => (
          <li key={`store-${index}`}>• {info}</li>
        ))}
      </ul>
    </div>
  );
}
