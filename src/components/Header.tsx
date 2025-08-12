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

export default function Header() {
  const { totalItems, setCartOpen } = useCart(); // Use Redux hook
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    // { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "اتصل بنا" },
    { href: "/brands", label: "البراندات" },
    { href: "/offers", label: "اخر العروض" },
    { href: "/products", label: "المنتجات" },
    // { href: "/pricing", label: "تسعير القطع" },
    { href: "/userPricing", label: "طلب تسعير" },
  ];

  const languages = [
    { code: "ar", name: " - العربية", flag: "🇸🇦" },
    { code: "en", name: " - English", flag: "🇺🇸" },
  ];

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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <Image src="/logo-icon.jpeg" alt="logo" width={40} height={50} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActiveLink(link.href)
                    ? "text-logo-gold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-logo-gold"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Dropdown - Desktop */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2  px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Globe size={16} />
                <span>العربية</span>
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
                    className="absolute top-full right-0 mt-1 w-48 max-w-[calc(100vw-2rem)] bg-white rounded-md shadow-lg border border-gray-200 z-50 transform -translate-x-0 lg:translate-x-0"
                    style={{ right: 0, left: "auto" }}
                  >
                    <div className="py-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 space-x-reverse"
                          onClick={() => setIsLanguageOpen(false)}
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
              {/* Optional: Add notification badge */}
              {/* <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                3
              </motion.span> */}
            </Link>

            {/* Cart button */}
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Login Dialog - Desktop */}
            <LoginDialog />
          </div>

          {/* Mobile/Tablet right side */}
          <div className="lg:hidden flex items-center space-x-reverse space-x-2">
            {/* Notification button - Mobile/Tablet */}
            <Link
              href="/userprofile"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={20} />
              {/* Optional: Add notification badge */}
              {/* <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]"
              >
                3
              </motion.span> */}
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
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Language Dropdown - Mobile/Tablet */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 space-x-reverse px-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Globe size={16} />
                <span className="text-xs hidden sm:inline">العربية</span>
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
                    className="absolute top-full right-0 mt-1 w-40 max-w-[calc(100vw-2rem)] bg-white rounded-md shadow-lg border border-gray-200 z-500"
                    style={{
                      left: 0,
                      right: "auto",
                      transform: "translateX(0)",
                    }}
                  >
                    <div className="py-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 space-x-reverse"
                          onClick={() => setIsLanguageOpen(false)}
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
              <span className="sr-only">فتح القائمة الرئيسية</span>
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-3 py-3 rounded-md text-base font-medium transition-colors relative ${
                        isActiveLink(link.href)
                          ? "text-logo-gold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-logo-gold"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
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
                        <User className="ml-2" />
                        تسجيل الدخول
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
