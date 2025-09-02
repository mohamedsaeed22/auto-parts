import { User, MapPin, ShoppingBag, Settings, Bell, Gift } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { ProfilePage } from "@/app/[locale]/userprofile/page";

export default function UserProfileSidebar({
  activePage,
  onPageChange,
}: {
  activePage: ProfilePage;
  onPageChange: (page: ProfilePage) => void;
}) {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const menu = [
    { key: "overview", labelKey: "sidebar.overview", icon: <User size={20} /> },
    { key: "points", labelKey: "sidebar.points", icon: <Gift size={20} /> },
    {
      key: "notifications",
      labelKey: "sidebar.notifications",
      icon: <Bell size={20} />,
    },
    {
      key: "orders",
      labelKey: "sidebar.orders",
      icon: <ShoppingBag size={20} />,
    },
    {
      key: "addresses",
      labelKey: "sidebar.addresses",
      icon: <MapPin size={20} />,
    },
    // { key: "wishlist", labelKey: "sidebar.wishlist", icon: <Heart size={20} /> },
    {
      key: "settings",
      labelKey: "sidebar.settings",
      icon: <Settings size={20} />,
    },
  ];

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
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors font-medium ${
                    activePage === item.key
                      ? "bg-yellow-100 text-yellow-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => onPageChange(item.key as ProfilePage)}
                >
                  <span>{item.icon}</span>
                  <span className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
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
            className={`flex flex-col items-center justify-center min-w-[70px] px-2 py-2 rounded-md transition-colors font-medium ${
              activePage === item.key
                ? "bg-yellow-100 text-yellow-800"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => onPageChange(item.key as ProfilePage)}
          >
            <span>{item.icon}</span>
            <span className="text-xs mt-1">{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </>
  );
}