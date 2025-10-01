"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const ReturnExchangePolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">
        {t("returnExchangePolicy.title", "Return & Exchange Policy")}
      </h1>
      <div className="prose max-w-none">
        {/* Page content will be added here */}
      </div>
    </div>
  );
};

export default ReturnExchangePolicyPage;
