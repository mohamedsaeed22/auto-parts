"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ChevronDown,
  Globe,
  ShoppingCart,
  Search,
  X,
  Home,
  Grid3X3,
  Tag,
  Heart,
  Menu,
} from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { t, i18n } = useTranslation("header");
  const activeLocale = i18n.language;
  const isRTL = activeLocale === "ar";

  const navLinks = [
    { href: "/about", label: t("navigation.about") },
    { href: "/contact", label: t("navigation.contact") },
    { href: "/brands", label: t("navigation.brands") },
    { href: "/offers", label: t("navigation.offers") },
    { href: "/products", label: t("navigation.products") },
    { href: "/userPricing", label: t("navigation.userPricing") },
  ];

  const languages = [
    { code: "ar", name: t("language.arabic"), flag: "🇸🇦" },
    { code: "en", name: t("language.english"), flag: "🇺🇸" },
  ];

  // Bottom navigation items for mobile
  const bottomNavItems = [
    {
      href: "/",
      icon: Home,
      label: t("bottomNav.home") || "Home",
      isActive: pathname === "/",
    },
    {
      href: "/products",
      icon: Grid3X3,
      label: t("bottomNav.categories") || "Categories",
      isActive: pathname.startsWith("/products"),
    },
    {
      href: "/offers",
      icon: Tag,
      label: t("bottomNav.offers") || "Offers",
      isActive: pathname.startsWith("/offers"),
    },
    {
      href: "/wishlist",
      icon: Heart,
      label: t("bottomNav.wishlist") || "Wishlist",
      isActive: pathname.startsWith("/wishlist"),
    },
    {
      href: "#",
      icon: ShoppingCart,
      label: t("bottomNav.cart") || "Cart",
      isActive: false,
      isCart: true,
    },
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page or handle search
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Helper function to check if link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const currentLanguage = languages.find((lang) => lang.code === activeLocale);

  const handleBottomNavClick = (item: { href?: string; isCart?: boolean }) => {
    if (item.isCart) {
      handleCartClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <>
      {/* Main Header */}
      <header
        className="bg-white shadow-sm sticky top-0 z-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Main Header Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/logo-icon.jpeg"
                  alt="logo"
                  width={40}
                  height={50}
                  className="lg:w-12 lg:h-15"
                />
              </Link>
            </div>

            {/* Desktop Search Bar - Centered */}
            <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="relative">
                  <Search
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${
                      isRTL ? "right-4" : "left-4"
                    }`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      t("actions.searchPlaceholder") || "Search products..."
                    }
                    className={`w-full ${
                      isRTL ? "pr-12 pl-12 text-right" : "pl-12 pr-12 text-left"
                    } py-3 border-2 border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-logo-gold focus:border-logo-gold transition-all bg-gray-50 focus:bg-white`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                        isRTL ? "left-4" : "right-4"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Globe size={18} />
                  <span>{currentLanguage?.name}</span>
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
                        isRTL ? "left-0" : "right-0"
                      } mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50`}
                    >
                      <div className="py-2">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            className={`w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors ${
                              isRTL ? "text-right" : "text-left"
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

              {/* Account */}
              <LoginDialog
                trigger={
                  <button className="flex items-center gap-2 text-gray-700 hover:text-logo-gold transition-colors">
                    <User size={20} />
                    <span className="text-sm font-medium">
                      {t("actions.account") || "Account"}
                    </span>
                  </button>
                }
              />

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-700 hover:text-logo-gold transition-colors"
              >
                <Heart size={24} />
              </Link>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative flex items-center gap-2 text-gray-700 hover:text-logo-gold transition-colors"
              >
                <div className="relative">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-2 ${
                        isRTL ? "-left-2" : "-right-2"
                      } bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </div>
              </button>
            </div>

            {/* Mobile Right Actions */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-logo-gold transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Language Dropdown - Mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="p-2 text-gray-700 hover:text-logo-gold transition-colors"
                >
                  <Globe size={20} />
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
                      } mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50`}
                    >
                      <div className="py-1">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            className={`w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 ${
                              isRTL ? "text-right" : "text-left"
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

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-logo-gold transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-0">
            <nav className="flex items-center justify-center gap-8 h-12">
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
                    className={`absolute -bottom-2 ${
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
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200 px-4 py-3"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <Search
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${
                      isRTL ? "right-3" : "left-3"
                    }`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      t("actions.searchPlaceholder") || "Search products..."
                    }
                    className={`w-full ${
                      isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10 text-left"
                    } py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-logo-gold focus:border-logo-gold transition-colors`}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                        isRTL ? "left-3" : "right-3"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
                onClick={closeMobileMenu}
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
                    onClick={closeMobileMenu}
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
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={closeMobileMenu}
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
                    className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t("menu.help") || "Help & Support"}
                  </Link>
                  <Link
                    href="/track-order"
                    className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {t("menu.trackOrder") || "Track Your Order"}
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Navigation - xs and sm only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <nav
          className="flex items-center justify-around h-16 px-2"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => handleBottomNavClick(item)}
                className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                  item.isActive
                    ? "text-logo-gold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {item.isCart && totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </div>
                <span className="text-xs font-medium mt-1 leading-none text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Click outside handlers */}
      {isLanguageOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsLanguageOpen(false)}
        />
      )}

      {/* Add bottom padding to body content on mobile to account for bottom nav */}
      <style jsx global>{`
        @media (max-width: 639px) {
          body {
            padding-bottom: 64px;
          }
        }
      `}</style>
    </>
  );
}
