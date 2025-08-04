"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarFront, User, ChevronDown, Globe, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const { totalItems, setCartOpen } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/", label: "من نحن" },
    { href: "/", label: "اتصل بنا" },
    { href: "/", label: "البراندات" },
    { href: "/", label: "المنتجات" },
    { href: "/", label: "اخر العروض" },
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
  return (
    <header className="bg-white shadow-sm relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center p-2 rounded-full bg-yellow-100">
            <Link href="/">
              <CarFront />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Dropdown */}
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
                    className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
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
            <Button variant="outline">
              <User />
            </Button>
          </div>

          {/* Mobile/Tablet right side */}
          <div className="lg:hidden flex items-center space-x-reverse space-x-2">
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
                    className="absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50"
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
              // className="fixed inset-0 bg-black/50 z-1 backdrop-blur-sm  md:hidden"
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
                      className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
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
                  <Button variant="outline" className="w-full justify-center">
                    <User className="ml-2" />
                    تسجيل الدخول
                  </Button>
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
