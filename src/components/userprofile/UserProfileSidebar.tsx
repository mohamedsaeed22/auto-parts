import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Settings,
  Bell,
  Gift,
} from "lucide-react";
import React from "react";
import { ProfilePage } from "@/app/userprofile/page";

const menu = [
  { key: "overview", label: "الملف الشخصي", icon: <User size={20} /> },
  { key: "points", label: "نقاطي", icon: <Gift size={20} /> },
  { key: "notifications", label: "الإشعارات", icon: <Bell size={20} /> },
  { key: "orders", label: "الطلبات", icon: <ShoppingBag size={20} /> },
  { key: "addresses", label: "العناوين", icon: <MapPin size={20} /> },
  // { key: "wishlist", label: "المفضلة", icon: <Heart size={20} /> },
  { key: "settings", label: "الإعدادات", icon: <Settings size={20} /> },
];

export default function UserProfileSidebar({
  activePage,
  onPageChange,
}: {
  activePage: ProfilePage;
  onPageChange: (page: ProfilePage) => void;
}) {
  // Responsive: show sidebar on lg+, show top bar on mobile
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8 min-w-[220px]">
        <nav>
          <ul className="flex flex-col gap-4 text-right">
            {menu.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex flex-row-reverse items-center justify-end gap-3 text-right px-4 py-2 rounded-md transition-colors font-medium ${
                    activePage === item.key
                      ? "bg-yellow-100 text-yellow-800"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => onPageChange(item.key as ProfilePage)}
                >
                  <span>{item.label}</span>
                  <span>{item.icon}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile/Tablet Top Bar */}
      <div className="lg:hidden flex overflow-x-auto gap-2 mb-4">
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
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
