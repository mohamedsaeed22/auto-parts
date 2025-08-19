"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ChevronDown, Globe, ShoppingCart, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart"; // Use Redux hook
import LoginDialog from "./LoginDialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { i18nConfig } from "@/lib/i18n";

export default function Header() {
  const { totalItems, setCartOpen } = useCart(); // Use Redux hook
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const activeLocale = i18n.language;
  const isRTL = activeLocale === "ar";

  const navLinks = [
    { href: "/about", label: t("header.navigation.about") },
    { href: "/contact", label: t("header.navigation.contact") },
    { href: "/brands", label: t("header.navigation.brands") },
    { href: "/offers", label: t("header.navigation.offers") },
    { href: "/products", label: t("header.navigation.products") },
    { href: "/userPricing", label: t("header.navigation.userPricing") },
  ];

  const languages = [
    { code: "ar", name: t("header.language.arabic"), flag: "🇸🇦" },
    { code: "en", name: t("header.language.english"), flag: "🇺🇸" },
  ];

  const router = useRouter();
  const currentPathname = usePathname();

  const onLanguageChange = () => {
    const newLocale = activeLocale === "en" ? "ar" : "en";

    // Set a cookie for next-i18n-router to read the new locale
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // Compute new path with updated locale
    if (
      activeLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(currentPathname.replace(`/${activeLocale}`, `/${newLocale}`));
    }

    router.refresh();
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  // Helper function to check if link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const currentLanguage = languages.find((lang) => lang.code === activeLocale);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <Image src="/logo-icon.jpeg" alt="logo" width={40} height={50} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-evenly flex-1 max-w-2xl mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-2 text-sm font-medium transition-all duration-300 ${
                  isActiveLink(link.href)
                    ? "text-logo-gold"
                    : "text-gray-700 hover:text-logo-gold"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 ${
                    isRTL ? "right-0" : "left-0"
                  } w-full h-0.5 bg-logo-gold transform ${
                    isRTL ? "origin-right" : "origin-left"
                  } transition-transform duration-300 ${
                    isActiveLink(link.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right side buttons - Desktop */}
          <div
            className={`hidden lg:flex items-center ${
              isRTL ? "space-x-reverse space-x-4" : "space-x-4"
            }`}
          >
            {/* Language Dropdown - Desktop */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center ${
                  isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                } px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors`}
              >
                <Globe size={16} />
                <span>{currentLanguage?.name}</span>
                <ChevronDown
                  size={10}
                  className={`transition-transform ${
                    isLanguageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full ${
                      isRTL ? "left-0" : "right-0"
                    } mt-1 w-48 max-w-[calc(100vw-2rem)] bg-white rounded-md shadow-lg border border-gray-200 z-50`}
                  >
                    <div className="py-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className={`w-full ${
                            isRTL ? "text-right" : "text-left"
                          } px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${
                            isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                          }`}
                          onClick={onLanguageChange}
                        >
                          <span className="text-lg">{language.flag}</span>
                          <span>{language.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification button */}
            <Link
              href="/userprofile"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={24} />
            </Link>

            {/* Cart button */}
            <button
              onClick={handleCartClick}
              className={`relative p-2 hover:bg-gray-100 rounded-full transition-colors ${
                isRTL ? "mr-4" : "ml-4"
              }`}
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-1 ${
                    isRTL ? "-left-1" : "-right-1"
                  } bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Login Dialog - Desktop */}
            <LoginDialog />
          </div>

          {/* Mobile/Tablet right side */}
          <div
            className={`lg:hidden flex items-center ${
              isRTL ? "space-x-reverse space-x-2" : "space-x-2"
            }`}
          >
            {/* Notification button - Mobile/Tablet */}
            <Link
              href="/userprofile"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={20} />
            </Link>

            {/* Cart button - Mobile/Tablet */}
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-1 ${
                    isRTL ? "-left-1" : "-right-1"
                  } bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]`}
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Language Dropdown - Mobile/Tablet */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center ${
                  isRTL ? "space-x-reverse space-x-1" : "space-x-1"
                } px-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors`}
              >
                <Globe size={16} />
                <span className="text-xs hidden sm:inline">
                  {currentLanguage?.name}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform ${
                    isLanguageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full ${
                      isRTL ? "right-0" : "left-0"
                    } mt-1 w-40 max-w-[calc(100vw-2rem)] bg-white rounded-md shadow-lg border border-gray-200 z-500`}
                  >
                    <div className="py-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className={`w-full ${
                            isRTL ? "text-right" : "text-left"
                          } px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${
                            isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                          }`}
                          onClick={onLanguageChange}
                        >
                          <span className="text-base">{language.flag}</span>
                          <span className="text-xs">{language.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">
                {t("header.actions.openMainMenu")}
              </span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 lg:hidden rounded-md"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-3 py-3 rounded-md text-base font-medium transition-colors relative ${
                        isActiveLink(link.href)
                          ? `text-logo-gold after:content-[''] after:absolute after:bottom-0 after:${
                              isRTL ? "right-0" : "left-0"
                            } after:${
                              isRTL ? "left-0" : "right-0"
                            } after:h-0.5 after:bg-logo-gold`
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 border-t border-gray-200"
                >
                  {/* Login Dialog - Mobile */}
                  <LoginDialog
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                      >
                        <User className={isRTL ? "mr-2" : "ml-2"} />
                        {t("header.actions.login")}
                      </Button>
                    }
                  />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside handler for language dropdown */}
      {isLanguageOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsLanguageOpen(false)}
        />
      )}
    </header>
  );
}
