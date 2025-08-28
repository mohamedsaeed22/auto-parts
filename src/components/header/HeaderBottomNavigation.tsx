import { motion } from "framer-motion";
import {
  Home,
  Grid3X3,
  Tag,
  ShoppingCart,
  Heart,
  Bookmark,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface HeaderBottomNavigationProps {
  totalItems: number;
  onCartClick: () => void;
  isRTL: boolean;
  pathname: string;
}

export default function HeaderBottomNavigation({
  totalItems,
  onCartClick,
  isRTL,
  pathname,
}: HeaderBottomNavigationProps) {
  const { t } = useTranslation("header");
  const router = useRouter();

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
      href: "/favourites",
      icon: Heart,
      label: t("bottomNav.favourites") || "Favourites",
      isActive: pathname.startsWith("/favourites"),
    },
    {
      href: "/wishlist",
      icon: Bookmark,
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

  const handleBottomNavClick = (item: { href?: string; isCart?: boolean }) => {
    if (item.isCart) {
      onCartClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
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
  );
}
