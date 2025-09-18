import {
  User,
  FileText,
  MapPin,
  ShoppingBag,
  Settings,
  Star,
} from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProfilePageType } from "@/app/[locale]/userprofile/page";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfileSidebar({
  activePage,
  onPageChange,
}: {
  activePage: ProfilePageType;
  onPageChange: (page: ProfilePageType) => void;
}) {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";
  const { user } = useAuth();
  const isRegistrationComplete = Boolean(user?.is_registration_complete);

  // Ensure profile is selected by default if no activePage is set
  const currentActivePage = activePage || "profile";

  // Save active page to localStorage whenever it changes
  useEffect(() => {
    try {
      if (
        currentActivePage &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        localStorage.setItem("userProfileActivePage", currentActivePage);
      }
    } catch (error) {
      console.warn("Failed to save active page to localStorage:", error);
    }
  }, [currentActivePage]);

  const fullMenu = [
    { key: "profile", labelKey: "sidebar.profile", icon: <User size={20} /> },
    {
      key: "addresses",
      labelKey: "sidebar.addresses",
      icon: <MapPin size={20} />,
    },
    {
      key: "orders",
      labelKey: "sidebar.orders",
      icon: <ShoppingBag size={20} />,
    },
    {
      key: "requests",
      labelKey: "sidebar.requests",
      icon: <FileText size={20} />,
    },
    {
      key: "points",
      labelKey: "sidebar.points",
      icon: <Star size={20} />,
    },
    {
      key: "settings",
      labelKey: "sidebar.settings",
      icon: <Settings size={20} />,
    },
  ];

  const menu = isRegistrationComplete
    ? fullMenu
    : fullMenu.filter((item) => item.key !== "requests");

  // If registration is incomplete and current page is requests, redirect to profile
  useEffect(() => {
    if (!isRegistrationComplete && currentActivePage === "requests") {
      onPageChange("profile");
    }
  }, [isRegistrationComplete, currentActivePage, onPageChange]);

  // Responsive: show sidebar on lg+, show top bar on mobile
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8 min-w-[220px]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <nav>
          <ul
            className={`flex flex-col gap-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {menu.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 font-medium relative ${
                    currentActivePage === item.key
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "hover:bg-gray-100 text-gray-700 hover:text-primary-600 hover:scale-[1.01]"
                  }`}
                  onClick={() => onPageChange(item.key as ProfilePageType)}
                >
                  {currentActivePage === item.key && (
                    <div
                      className={`absolute top-0 bottom-0 w-1  rounded-full ${
                        isRTL ? "right-0" : "left-0"
                      }`}
                    />
                  )}
                  <span>{item.icon}</span>
                  <span
                    className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {t(item.labelKey)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile/Tablet Top Bar */}
      <div
        className="lg:hidden flex overflow-x-auto gap-2 mb-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {menu.map((item) => (
          <button
            key={item.key}
            className={`flex flex-col items-center justify-center min-w-[70px] px-2 py-2 rounded-md transition-all duration-200 font-medium ${
              currentActivePage === item.key
                ? "bg-primary text-white shadow-md transform scale-105"
                : "hover:bg-gray-100 text-gray-700 hover:text-primary-600 hover:scale-105"
            }`}
            onClick={() => onPageChange(item.key as ProfilePageType)}
          >
            <span>{item.icon}</span>
            <span className="text-xs mt-1">{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </>
  );
}
