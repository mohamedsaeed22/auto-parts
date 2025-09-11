"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutMutation } from "@/services/hooks";
import { showSuccess, showError } from "@/lib/toast";
import { shouldRedirectToHomeOnLogout } from "@/lib/utils/routeUtils";

interface UserDropdownProps {
  isRTL: boolean;
}

export default function UserDropdown({ isRTL }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("header");
  const router = useRouter();
  const pathname = usePathname();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { user, logout } = useAuth();
  console.log("user", user);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();

      // Clear auth data from browser using hook
      logout();

      // Show success message
      showSuccess("تم تسجيل الخروج بنجاح");

      // Close dropdown
      setIsOpen(false);

      // Smart redirect: only redirect to home if current page is protected
      if (shouldRedirectToHomeOnLogout(pathname)) {
        router.push("/");
      }
      // If not protected, stay on current page
    } catch (error: any) {
      console.error("Error logging out:", error);

      // Check if it's a 404 error (route not found)
      const is404Error = error?.status === 404 || error?.data?.code === 404;

      if (is404Error) {
        // If logout endpoint doesn't exist (404), still clear local auth data
        console.log(
          "Logout endpoint not found (404), clearing local auth data anyway"
        );
        logout();

        // Show success message since we successfully cleared local data
        showSuccess("تم تسجيل الخروج بنجاح");

        // Close dropdown
        setIsOpen(false);

        // Smart redirect: only redirect to home if current page is protected
        if (shouldRedirectToHomeOnLogout(pathname)) {
          router.push("/");
        }
      } else {
        // For other errors, show error message
        showError("حدث خطأ أثناء تسجيل الخروج");
      }
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push("/userprofile");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-neutral-700 hover:text-primary transition-colors"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <span className="text-sm font-medium hidden sm:inline">
          {user.name || user.phone}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-full mt-2 ${
              isRTL ? "left-0" : "right-0"
            } w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50`}
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-neutral-100">
              <p className="text-sm font-medium text-neutral-900">
                {user.name || "User"}
              </p>
              <p className="text-xs text-neutral-500">{user.phone}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* Account/Profile */}
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Settings size={16} />
                <span>{t("actions.account") || "Account"}</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <LogOut size={16} />
                <span>
                  {isLoggingOut
                    ? t("actions.loggingOut") || "Logging out..."
                    : t("actions.logout") || "Logout"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
