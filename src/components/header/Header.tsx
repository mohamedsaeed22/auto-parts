"use client";

import { useState } from "react";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu } from "lucide-react";
import HeaderLogo from "./HeaderLogo";
import SearchAutocomplete from "./SearchAutocomplete";
import HeaderLanguageDropdown from "./HeaderLanguageDropdown";
import HeaderActions from "./HeaderActions";
import HeaderNavigation from "./HeaderNavigation";
import HeaderMobileMenu from "./HeaderMobileMenu";
import HeaderBottomNavigation from "./HeaderBottomNavigation";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useHeaderSearch } from "@/hooks/useHeaderSearch";

export default function Header() {
  const { totalItems, setCartOpen } = useEnhancedCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation("header");
  const { currentLocale, changeLocale, isRTL } = useLocale();
  const router = useRouter();
  const {
    searchQuery,
    updateSearchQuery,
    submitSearchQuery,
    clearSearchQuery,
  } = useHeaderSearch();

  const navLinks = [
    { href: "/about", label: t("navigation.about") },
    { href: "/contact", label: t("navigation.contact") },
    { href: "/categories", label: t("navigation.categories") },
    { href: "/brands", label: t("navigation.brands") },
    { href: "/latestoffer", label: t("navigation.offers") },
    { href: "/products", label: t("navigation.products") },
    { href: "/userPricing", label: t("navigation.userPricing") },
  ];

  const onLanguageChange = (newLocale: string) => {
    if (newLocale !== currentLocale) {
      changeLocale(newLocale);
    }
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
      // Submit search query (updates URL)
      submitSearchQuery(searchQuery.trim());

      // Navigate to products page with search parameter
      const locale = currentLocale;
      router.push(
        `/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`
      );

      setIsSearchOpen(false);
      // Don't clear the search query - let the URL sync handle it
    }
  };

  const clearSearch = () => {
    clearSearchQuery();
  };

  // Helper function to check if link is active
  const isActiveLink = (href: string) => {
    // Remove locale prefix from pathname for comparison
    const pathWithoutLocale =
      pathname.replace(/^\/[a-z]{2}(\/|$)/, "/").replace(/\/$/, "") || "/";
    const normalizedHref = href === "/" ? "/" : href.replace(/\/$/, "");

    if (normalizedHref === "/") {
      return pathWithoutLocale === "/";
    }
    return pathWithoutLocale.startsWith(normalizedHref);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className="bg-background shadow-sm sticky top-0 z-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Main Header Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <HeaderLogo />

            {/* Desktop Search Bar - Centered */}
            <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
              <SearchAutocomplete
                searchQuery={searchQuery}
                setSearchQuery={updateSearchQuery}
                onSubmit={handleSearchSubmit}
                onClear={clearSearch}
                onSuggestionSelect={submitSearchQuery}
                isRTL={isRTL}
                placeholder={
                  t("actions.searchPlaceholder") || "Search products..."
                }
                isDesktop={true}
              />
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <HeaderLanguageDropdown
                isOpen={isLanguageOpen}
                setIsOpen={setIsLanguageOpen}
                onLanguageChange={onLanguageChange}
                isRTL={isRTL}
                activeLocale={currentLocale}
              />
              <HeaderActions
                totalItems={totalItems}
                onCartClick={handleCartClick}
                isRTL={isRTL}
              />
            </div>

            {/* Mobile Right Actions */}
            <div className="lg:hidden flex items-center gap-1">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 transition-all duration-150 ${
                  isSearchOpen
                    ? "text-primary bg-primary-50 rounded-lg"
                    : "text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-lg"
                }`}
              >
                <Search size={20} />
              </button>

              {/* Language Dropdown - Mobile */}
              <HeaderLanguageDropdown
                isOpen={isLanguageOpen}
                setIsOpen={setIsLanguageOpen}
                onLanguageChange={onLanguageChange}
                isRTL={isRTL}
                activeLocale={currentLocale}
                isMobile={true}
              />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-neutral-700 hover:text-primary transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <HeaderNavigation
          navLinks={navLinks}
          isActiveLink={isActiveLink}
          isRTL={isRTL}
        />

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
              className="lg:hidden bg-background border-t border-border px-4 py-3"
            >
              <SearchAutocomplete
                searchQuery={searchQuery}
                setSearchQuery={updateSearchQuery}
                onSubmit={handleSearchSubmit}
                onClear={clearSearch}
                onSuggestionSelect={submitSearchQuery}
                isRTL={isRTL}
                placeholder={
                  t("actions.searchPlaceholder") || "Search products..."
                }
                isDesktop={false}
                autoFocus={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <HeaderMobileMenu
          isOpen={isMenuOpen}
          onClose={closeMobileMenu}
          navLinks={navLinks}
          isActiveLink={isActiveLink}
          isRTL={isRTL}
        />
      </header>

      {/* Mobile Bottom Navigation - xs and sm only */}
      <HeaderBottomNavigation
        totalItems={totalItems}
        onCartClick={handleCartClick}
        isRTL={isRTL}
        pathname={pathname}
      />

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
