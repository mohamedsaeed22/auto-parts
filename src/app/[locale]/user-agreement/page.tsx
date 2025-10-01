"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Shield,
  Users,
  CreditCard,
  Copyright,
  AlertCircle,
  CheckCircle,
  Lock,
  Mail,
  Settings,
  Scale,
  Globe,
} from "lucide-react";

const UserAgreementPage = () => {
  const { t, i18n } = useTranslation("userAgreement");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  type ColorType =
    | "blue"
    | "purple"
    | "green"
    | "indigo"
    | "teal"
    | "amber"
    | "cyan"
    | "orange"
    | "emerald"
    | "pink"
    | "red"
    | "violet"
    | "slate"
    | "gray";

  const sections: Array<{
    key: string;
    icon: React.ReactNode;
    color: ColorType;
  }> = [
    {
      key: "introduction",
      icon: <FileText className="w-6 h-6" />,
      color: "blue",
    },
    {
      key: "definitions",
      icon: <Globe className="w-6 h-6" />,
      color: "purple",
    },
    {
      key: "eligibility",
      icon: <Users className="w-6 h-6" />,
      color: "green",
    },
    {
      key: "storeCommitment",
      icon: <Shield className="w-6 h-6" />,
      color: "indigo",
    },
    {
      key: "usageGuidelines",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "teal",
    },
    {
      key: "accounts",
      icon: <Lock className="w-6 h-6" />,
      color: "amber",
    },
    {
      key: "communications",
      icon: <Mail className="w-6 h-6" />,
      color: "cyan",
    },
    {
      key: "modifications",
      icon: <Settings className="w-6 h-6" />,
      color: "orange",
    },
    {
      key: "payment",
      icon: <CreditCard className="w-6 h-6" />,
      color: "emerald",
    },
    {
      key: "intellectualProperty",
      icon: <Copyright className="w-6 h-6" />,
      color: "pink",
    },
    {
      key: "storeResponsibility",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "red",
    },
    {
      key: "membershipRestriction",
      icon: <Shield className="w-6 h-6" />,
      color: "violet",
    },
    {
      key: "applicableLaw",
      icon: <Scale className="w-6 h-6" />,
      color: "slate",
    },
    {
      key: "generalProvisions",
      icon: <FileText className="w-6 h-6" />,
      color: "gray",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    indigo: "bg-indigo-100 text-indigo-600",
    teal: "bg-teal-100 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    cyan: "bg-cyan-100 text-cyan-600",
    orange: "bg-orange-100 text-orange-600",
    emerald: "bg-emerald-100 text-emerald-600",
    pink: "bg-pink-100 text-pink-600",
    red: "bg-red-100 text-red-600",
    violet: "bg-violet-100 text-violet-600",
    slate: "bg-slate-100 text-slate-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      dir={direction}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {t("title", "User Agreement")}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t(
              "subtitle",
              "Terms and conditions governing the use of our online store"
            )}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.key}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    colorClasses[section.color]
                  }`}
                >
                  {section.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t(`${section.key}.title`)}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Main content */}
                {(() => {
                  const content = t(`${section.key}.content`, {
                    returnObjects: true,
                    defaultValue: null,
                  });
                  const contentKey = `${section.key}.content`;

                  // Don't render if content is null or equals the key itself (not translated)
                  if (
                    content === null ||
                    (typeof content === "string" && content === contentKey)
                  ) {
                    return null;
                  }

                  return (
                    <>
                      {Array.isArray(content) ? (
                        (content as string[]).map(
                          (item: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                            >
                              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                              <p className="text-gray-700 leading-relaxed">
                                {item}
                              </p>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {String(content)}
                        </p>
                      )}
                    </>
                  );
                })()}

                {/* Points if exists */}
                {t(`${section.key}.points`, {
                  returnObjects: true,
                  defaultValue: [],
                }) instanceof Array &&
                  (
                    t(`${section.key}.points`, {
                      returnObjects: true,
                      defaultValue: [],
                    }) as string[]
                  ).length > 0 && (
                    <ul className="space-y-3 mt-4">
                      {(
                        t(`${section.key}.points`, {
                          returnObjects: true,
                        }) as string[]
                      ).map((point: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border-l-4 border-primary"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="inline-block p-6 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-gray-700 max-w-2xl">
              {t(
                "footerNote",
                "By using our services, you acknowledge that you have read, understood, and agreed to be bound by these terms and conditions."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAgreementPage;
