import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LoginDialog from "../LoginDialog";

interface NavLink {
  href: string;
  label: string;
}

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  isActiveLink: (href: string) => boolean;
  isRTL: boolean;
}

export default function HeaderMobileMenu({
  isOpen,
  onClose,
  navLinks,
  isActiveLink,
  isRTL,
}: HeaderMobileMenuProps) {
  const { t } = useTranslation("header");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Mobile Menu Panel */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 300 : -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 300 : -300 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 ${
              isRTL ? "right-0" : "left-0"
            } h-full w-80 max-w-[85vw] bg-white shadow-lg z-50 lg:hidden overflow-y-auto`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("menu.title") || "Menu"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Account Section */}
            <div className="p-4 border-b border-gray-200">
              <LoginDialog
                trigger={
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2"
                  >
                    <User size={20} />
                    {t("actions.login") || "Login / Register"}
                  </Button>
                }
              />
            </div>

            {/* Navigation Links */}
            <div className="py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 text-base font-medium transition-colors relative ${
                      isActiveLink(link.href)
                        ? "text-logo-gold bg-yellow-50"
                        : "text-gray-700 hover:text-logo-gold hover:bg-gray-50"
                    }`}
                    onClick={onClose}
                  >
                    {link.label}
                    {/* Active indicator */}
                    {isActiveLink(link.href) && (
                      <span
                        className={`absolute top-0 bottom-0 w-1 bg-logo-gold ${
                          isRTL ? "right-0" : "left-0"
                        }`}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Additional Links */}
            <div className="py-4 border-t border-gray-200">
              <Link
                href="/help"
                className="block px-4 py-3 text-sm text-gray-600 hover:text-logo-gold transition-colors"
                onClick={onClose}
              >
                {t("menu.help") || "Help & Support"}
              </Link>
              <Link
                href="/track-order"
                className="block px-4 py-3 text-sm text-gray-600 hover:text-logo-gold transition-colors"
                onClick={onClose}
              >
                {t("menu.trackOrder") || "Track Your Order"}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
