import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Home,
  Grid3X3,
  ShoppingCart,
  Heart,
  Bookmark,
  Bell,
  UserCircle,
  Star,
  Gift,
  HelpCircle,
  Truck,
  LogOut,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import LoginDialog from "../LoginDialog";
// import UserDropdown from "./UserDropdown";
import { useAuth } from "@/hooks/useAuth";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import Image from "next/image";
import { useLogoutMutation } from "@/services/hooks";

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
  onCartClick: () => void;
}

export default function HeaderMobileMenu({
  isOpen,
  onClose,
  navLinks,
  isActiveLink,
  isRTL,
  onCartClick,
}: HeaderMobileMenuProps) {
  const { t } = useTranslation("header");
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useEnhancedCart();
  const router = useRouter();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (e) {
      // ignore API errors, proceed with local logout
    }
    logout();
    onClose();
  };

  // Navigation items based on authentication status
  const getNavigationItems = () => {
    if (isAuthenticated) {
      return [
        // User Profile Section
        {
          type: "profile",
          items: [
            {
              href: "/userprofile",
              icon: UserCircle,
              label: t("mobileMenu.profile") || "My Profile",
              isActive: isActiveLink("/userprofile"),
            },
            {
              href: "/userprofile/points",
              icon: Star,
              label: t("mobileMenu.points") || "My Points",
              isActive: isActiveLink("/userprofile/points"),
              badge: user?.points || 0,
            },
            {
              href: "/notifications",
              icon: Bell,
              label: t("mobileMenu.notifications") || "Notifications",
              isActive: isActiveLink("/notifications"),
            },
          ],
        },
        // Shopping Section
        {
          type: "shopping",
          title: t("mobileMenu.shopping") || "Shopping",
          items: [
            {
              href: "/favourites",
              icon: Heart,
              label: t("mobileMenu.favourites") || "Favourites",
              isActive: isActiveLink("/favourites"),
            },
            {
              href: "/wishlist",
              icon: Bookmark,
              label: t("mobileMenu.wishlist") || "Wishlist",
              isActive: isActiveLink("/wishlist"),
            },
            {
              href: "#",
              icon: ShoppingCart,
              label: t("mobileMenu.cart") || "Cart",
              isActive: false,
              isCart: true,
              badge: totalItems,
            },
            {
              href: "/userPricing",
              icon: Wrench,
              label:
                (t as unknown as (k: string) => string)(
                  "navigation.userPricing"
                ) ||
                (t as unknown as (k: string) => string)(
                  "mobileMenu.userPricing"
                ) ||
                "Request Pricing",
              isActive: isActiveLink("/userPricing"),
            },
          ],
        },
        // Main Navigation
        {
          type: "main",
          title: t("mobileMenu.explore") || "Explore",
          items: [
            {
              href: "/about",
              icon: Home,
              label: t("navigation.about") || "About Us",
              isActive: isActiveLink("/about"),
            },
            {
              href: "/contact",
              icon: HelpCircle,
              label: t("navigation.contact") || "Contact Us",
              isActive: isActiveLink("/contact"),
            },
            {
              href: "/",
              icon: Home,
              label: t("mobileMenu.home") || "Home",
              isActive: isActiveLink("/"),
            },
            {
              href: "/categories",
              icon: Grid3X3,
              label: t("mobileMenu.categories") || "Categories",
              isActive: isActiveLink("/categories"),
            },
            {
              href: "/brands",
              icon: Star,
              label: t("mobileMenu.brands") || "Brands",
              isActive: isActiveLink("/brands"),
            },
            {
              href: "/latestoffer",
              icon: Gift,
              label: t("mobileMenu.offers") || "Offers",
              isActive: isActiveLink("/latestoffer"),
            },
            {
              href: "/products",
              icon: Grid3X3,
              label: t("mobileMenu.products") || "Products",
              isActive: isActiveLink("/products"),
            },
            {
              href: "/userPricing",
              icon: Wrench,
              label:
                (t as unknown as (k: string) => string)(
                  "navigation.userPricing"
                ) ||
                (t as unknown as (k: string) => string)(
                  "mobileMenu.userPricing"
                ) ||
                "Request Pricing",
              isActive: isActiveLink("/userPricing"),
            },
          ],
        },
        // Support Section
        // {
        //   type: "support",
        //   title: t("mobileMenu.support") || "Support",
        //   items: [
        //     {
        //       href: "/track-order",
        //       icon: Truck,
        //       label: t("mobileMenu.trackOrder") || "Track Order",
        //       isActive: isActiveLink("/track-order"),
        //     },
        //     {
        //       href: "/help",
        //       icon: HelpCircle,
        //       label: t("mobileMenu.help") || "Help & Support",
        //       isActive: isActiveLink("/help"),
        //     },
        //   ],
        // },
      ];
    } else {
      return [
        // Guest Navigation
        {
          type: "main",
          title: t("mobileMenu.explore") || "Explore",
          items: [
            {
              href: "/about",
              icon: Home,
              label: t("navigation.about") || "About Us",
              isActive: isActiveLink("/about"),
            },
            {
              href: "/contact",
              icon: HelpCircle,
              label: t("navigation.contact") || "Contact Us",
              isActive: isActiveLink("/contact"),
            },
            {
              href: "/",
              icon: Home,
              label: t("mobileMenu.home") || "Home",
              isActive: isActiveLink("/"),
            },
            {
              href: "/categories",
              icon: Grid3X3,
              label: t("mobileMenu.categories") || "Categories",
              isActive: isActiveLink("/categories"),
            },
            {
              href: "/brands",
              icon: Star,
              label: t("mobileMenu.brands") || "Brands",
              isActive: isActiveLink("/brands"),
            },
            {
              href: "/latestoffer",
              icon: Gift,
              label: t("mobileMenu.offers") || "Offers",
              isActive: isActiveLink("/latestoffer"),
            },
            {
              href: "/products",
              icon: Grid3X3,
              label: t("mobileMenu.products") || "Products",
              isActive: isActiveLink("/products"),
            },
            {
              href: "/userPricing",
              icon: Wrench,
              label:
                (t as unknown as (k: string) => string)(
                  "navigation.userPricing"
                ) ||
                (t as unknown as (k: string) => string)(
                  "mobileMenu.userPricing"
                ) ||
                "Request Pricing",
              isActive: isActiveLink("/userPricing"),
            },
          ],
        },
        // Shopping Section (Guest)
        {
          type: "shopping",
          title: t("mobileMenu.shopping") || "Shopping",
          items: [
            {
              href: "#",
              icon: ShoppingCart,
              label: t("mobileMenu.cart") || "Cart",
              isActive: false,
              isCart: true,
              badge: totalItems,
            },
          ],
        },
        // Support Section
        {
          type: "support",
          title: t("mobileMenu.support") || "Support",
          items: [
            {
              href: "/help",
              icon: HelpCircle,
              label: t("mobileMenu.help") || "Help & Support",
              isActive: isActiveLink("/help"),
            },
          ],
        },
      ];
    }
  };

  type MenuItem = {
    href?: string;
    isCart?: boolean;
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.isCart) {
      onCartClick();
    } else if (item.href && item.href !== "#") {
      router.push(item.href);
    }
    onClose();
  };

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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-600">
              <div className="flex items-center gap-3">
                {isAuthenticated && user?.avatar && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src={user.avatar}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {isAuthenticated
                      ? user?.name || t("mobileMenu.welcome")
                      : t("menu.title")}
                  </h2>
                  {isAuthenticated && user?.points && (
                    <p className="text-sm text-white/80">
                      {user.points} {t("mobileMenu.points")}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-white/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Login Section for Guests */}
            {!isAuthenticated && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <LoginDialog
                  trigger={
                    <Button className="w-full justify-center gap-2 bg-primary hover:bg-primary-600">
                      <User size={20} />
                      {t("actions.login") || "Login / Register"}
                    </Button>
                  }
                />
              </div>
            )}

            {/* Navigation Sections */}
            <div className="py-2">
              {getNavigationItems().map((section, sectionIndex) => (
                <div key={section.type} className="mb-4">
                  {section.title && (
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {section.title}
                      </h3>
                    </div>
                  )}

                  {section.items?.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const totalDelay = sectionIndex * 0.1 + itemIndex * 0.05;

                    return (
                      <motion.div
                        key={item.href || item.label}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: totalDelay }}
                      >
                        <button
                          onClick={() => handleItemClick(item)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors relative ${
                            item.isActive
                              ? "text-primary bg-primary-50 border-r-2 border-primary"
                              : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
                          }`}
                        >
                          <div className="relative">
                            <Icon size={20} className="flex-shrink-0" />
                            {item.badge && item.badge > 0 && (
                              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Logout Button for authenticated users */}
            {isAuthenticated && (
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  {isLoggingOut
                    ? (t("actions.loggingOut") as string) || "Logging out..."
                    : (t("actions.logout") as string) || "Logout"}
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  {t("mobileMenu.version") || "Version 1.0.0"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
