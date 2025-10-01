"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Shield,
  Clock,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ReturnExchangePolicyPage = () => {
  const { t, i18n } = useTranslation("returnExchangePolicy");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const warrantyConditions = [
    {
      key: "noInstallationError",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      key: "originalInvoice",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      key: "noLaborCosts",
      icon: <XCircle className="w-5 h-5" />,
    },
    {
      key: "electricalNotCovered",
      icon: <XCircle className="w-5 h-5" />,
    },
  ];

  const returnPolicies = [
    {
      key: "sevenDays",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      key: "originalCondition",
      icon: <Package className="w-5 h-5" />,
    },
    {
      key: "defectiveItems",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      key: "shippingCosts",
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div
      dir={direction}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {t("title", "Return & Exchange Policy")}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t(
              "subtitle",
              "Terms and conditions for purchasing spare parts, warranty, return, and exchange policy"
            )}
          </p>
        </div>

        {/* Warranty Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t("warranty.title", "Warranty")}
              </h2>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {t(
                "warranty.description",
                "Spare parts are granted a 30-day warranty from the date of purchase according to the following conditions:"
              )}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {warrantyConditions.map((condition) => (
                <div
                  key={condition.key}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-primary mt-1">{condition.icon}</div>
                  <p className="text-gray-700 flex-1">
                    {t(`warranty.conditions.${condition.key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Return & Exchange Policy Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t("returnPolicy.title", "Return & Exchange Policy")}
              </h2>
            </div>

            <div className="space-y-4">
              {returnPolicies.map((policy) => (
                <div
                  key={policy.key}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border-l-4 border-blue-500"
                >
                  <div className="text-blue-600 mt-1">{policy.icon}</div>
                  <p className="text-gray-700 flex-1">
                    {t(`returnPolicy.policies.${policy.key}`)}
                  </p>
                </div>
              ))}
            </div>

            {/* Electrical & Electronic Parts */}
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                {t(
                  "returnPolicy.electrical.title",
                  "Electrical & Electronic Parts"
                )}
              </h3>
              <p className="text-gray-700 mb-4">
                {t(
                  "returnPolicy.electrical.description",
                  "Subject to special conditions, where they can only be exchanged or returned within 24 hours of receipt."
                )}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>
                    {t(
                      "returnPolicy.electrical.conditions.notUsed",
                      "Must not be used or installed"
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>
                    {t(
                      "returnPolicy.electrical.conditions.sealedPackage",
                      "Must be sealed in original packaging"
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>
                    {t(
                      "returnPolicy.electrical.conditions.technicalInspection",
                      "Subject to technical inspection before approval"
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exclusions Section */}
        <section>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t("exclusions.title", "Exclusions from Return or Exchange")}
              </h2>
            </div>

            <p className="text-gray-700 mb-6">
              {t(
                "exclusions.description",
                "Customers are not entitled to exchange or return parts in the following cases:"
              )}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {t(
                    "exclusions.cases.customMade",
                    "If the part is manufactured or imported specifically upon customer request, except in case of manufacturing defect or non-compliance with required specifications."
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {t(
                    "exclusions.cases.misuse",
                    "If the defect resulted from misuse or improper storage by the customer."
                  )}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {t(
                    "exclusions.cases.openedPackage",
                    "If the electrical or electronic part packaging has been opened or installed, or if the specified return period (24 hours from receipt) has been exceeded."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="inline-block p-6 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-gray-700 max-w-2xl">
              {t(
                "footerNote",
                "For any inquiries regarding our return and exchange policy, please contact our customer service team. We are here to help you."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnExchangePolicyPage;
